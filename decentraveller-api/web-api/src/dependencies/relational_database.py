from typing import Optional, Dict, List, Union, Callable, Tuple
from datetime import datetime

from sqlalchemy import func, case, tuple_, and_
from sqlalchemy.orm import Session

from src.api_models.bulk_results import PaginatedReviews, PaginatedPlaces
from src.api_models.place import PlaceID, PlaceInDB, PlaceWithStats
from src.api_models.profile import ProfileInDB, WalletID
from src.api_models.review import ReviewID, ReviewInDB, ReviewWithProfile, ReviewInput
from src.api_models.rule import RuleInput
from src.orms.image import ImageORM
from src.orms.place import PlaceORM
from src.orms.profile import ProfileORM
from src.orms.review import ReviewORM
from src.orms.review_image import ReviewImageORM
from src.orms.rule import RuleORM, RuleStatus
import logging

logger = logging.getLogger(__name__)


def build_relational_database():
    from src.database.session import SessionLocal

    db = RelationalDatabase(SessionLocal)
    try:
        yield db
    finally:
        db.close()


class RelationalDatabase:
    """
    Relational Database object
    """
    _session: Optional[Session]

    def __init__(self, session_maker: Callable):
        """

        :param session_maker: database session maker
        """
        self._session = session_maker()

    def close(self):
        """
        Close session
        """
        self._session.close()

    @property
    def session(self) -> Session:
        """
        Gets the sql session
        :return: the session
        """
        return self._session

    @staticmethod
    def relevancy_score(mean_score, review_count):
        """
        Computes the relevancy score
        :param mean_score: the mean score
        :param review_count: the review count
        :return: the relevancy score
        """
        return case((review_count == 0, 0), else_=mean_score * func.log(review_count))

    @staticmethod
    def km_distance_query_func(lat1: float, lon1: float,
                               lat2: float, lon2: float):
        """
        Km distance function for using inside a query
        :param lat1: the first latitude
        :param lon1: the first longitude
        :param lat2: the second latitude
        :param lon2: the second longitude
        :return: a distance
        """
        lat1_rad = func.radians(lat1)
        lon1_rad = func.radians(lon1)
        lat2_rad = func.radians(lat2)
        lon2_rad = func.radians(lon2)

        # Calculate the distance using the haversine formula
        dlon = lon2_rad - lon1_rad
        dlat = lat2_rad - lat1_rad
        sin_dlat = func.sin(dlat / 2)
        sin_dlon = func.sin(dlon / 2)
        a = sin_dlat * sin_dlat + func.cos(lat1_rad) * func.cos(lat2_rad) * sin_dlon * sin_dlon
        c = 2 * func.asin(func.sqrt(a))
        distance = 6371 * c  # Radius of the Earth in kilometers

        return distance

    def _get_places_by_ids(self, place_ids: List[PlaceID]) -> List[PlaceWithStats]:
        """
        Get places by id list
        :param place_ids: place id list
        :return: the places data
        """
        result = self.session.query(PlaceORM, func.avg(ReviewORM.score),
                                    func.count(ReviewORM.id)). \
            join(ReviewORM, ReviewORM.place_id == PlaceORM.id, isouter=True). \
            filter(PlaceORM.id.in_(tuple(place_ids))) \
            .group_by(PlaceORM.id).all()
        return [PlaceWithStats(**PlaceInDB.from_orm(p[0]).dict(),
                               score=p[1], reviews=p[2])
                for p in result]

    def _get_reviews_by_ids(self, ids: List[Tuple[ReviewID, PlaceID]]) \
            -> List[ReviewWithProfile]:
        """
        Get reviews by id
        :param ids: list of reviews and place ids
        :return: the reviews
        """
        result = self.session.query(ReviewORM, ProfileORM). \
            join(ProfileORM, ProfileORM.owner == ReviewORM.owner). \
            filter(tuple_(ReviewORM.id, ReviewORM.place_id).in_(tuple(ids))).all()
        image_counts = self.session.query(ReviewImageORM.review_id,
                                          ReviewImageORM.place_id,
                                          func.count(ReviewImageORM.hash)). \
            filter(tuple_(ReviewImageORM.review_id, ReviewORM.place_id).in_(tuple(ids))). \
            group_by(ReviewImageORM.review_id, ReviewImageORM.place_id). \
            all()
        image_counts = {(c[0], c[1]): c[2] for c in image_counts}
        parsed_result = []
        for p in result:
            count = 0
            if (p[0].id, p[0].place_id) in image_counts:
                count = image_counts[(p[0].id, p[0].place_id)]
            review = ReviewInDB(**p[0].__dict__, image_count=count).dict()
            review['owner'] = ProfileInDB.from_orm(p[1])
            parsed_result.append(review)
        return [ReviewWithProfile(**p)
                for p in parsed_result]

    def query_places(self, place_ids: Union[PlaceID, List[PlaceID]]) \
            -> Union[Optional[PlaceWithStats], List[PlaceWithStats]]:
        """
        Gets a place from the database by its id

        :param place_ids: the item id
        :return: a place ORM or None if the id does not exist
        """
        if isinstance(place_ids, list):
            if not place_ids:
                return []
            places = self._get_places_by_ids(place_ids)
            if places:
                return places
        if not isinstance(place_ids, list):
            place = self._get_places_by_ids([place_ids])
            if place:
                return place[0]

        return None

    def add_place(self, place: PlaceInDB) -> PlaceWithStats:
        """
        Add a place
        :param place: the place to add
        """
        place_orm = PlaceORM(**place.dict())
        self.session.add(place_orm)
        self.session.commit()
        return PlaceWithStats(**PlaceInDB.from_orm(place_orm).dict(),
                              score=None, reviews=0)

    def update_place(self, place_id: PlaceID, place_data: Dict) -> Optional[PlaceWithStats]:
        """
        Updates a place

        :param place_id: the id
        :param place_data: the data to update
        :return:
        """
        place_orm = self.session.query(PlaceORM).get(place_id)

        if place_orm is None:
            return None

        for k, v in place_data.items():
            place_orm.__setattr__(k, v)

        self.session.add(place_orm)
        self.session.commit()
        return self.query_places(place_id)

    def query_review(self, review_id: ReviewID, place_id: PlaceID) -> Optional[ReviewWithProfile]:
        """
        Gets a review from the database by its id

        :param review_id: the review id
        :param place_id: the place id
        :return: a review ORM or None if the id does not exist
        """
        reviews = self._get_reviews_by_ids([(review_id, place_id)])
        if not reviews:
            return None
        return reviews[0]

    def add_review(self, review: ReviewInput):
        """
        Adds a review to the database
        :param review: the review data to add
        :return:
        """
        review_orm = ReviewORM(id=review.id, place_id=review.place_id,
                               score=review.score, owner=review.owner,
                               text=review.text, state=review.state)
        self.session.add(review_orm)
        for h in review.images:
            image_orm = self.session.query(ImageORM).get(h)
            image_orm.pinned = True
            review_image_orm = ReviewImageORM(hash=h, review_id=review.id,
                                              place_id=review.place_id)
            self.session.add(image_orm)
            self.session.add(review_image_orm)
        self.session.commit()
        reviews = self._get_reviews_by_ids([(review.id, review.place_id)])
        return reviews[0]

    def get_profile_orm(self, owner: WalletID) -> Optional[ProfileORM]:
        """
        Database querying for a profile

        :param owner: the owner of the profile

        :return: a ProfileORM or none if missing
        """
        profile: Optional[ProfileORM] = self.session.query(ProfileORM).get(owner)
        return profile

    def query_reviews_by_place(self, place_id: PlaceID,
                               page: int, per_page: int) -> PaginatedReviews:
        """
        Gets all the reviews from a place as a query

        :param place_id: the id of the place
        :param page: page of the reviews
        :param per_page: items per page
        :return: the paginated reviews
        """
        query = self.session.query(ReviewORM.id, ReviewORM.place_id). \
            filter(ReviewORM.place_id == place_id)
        total_count = query.count()
        query = query.limit(per_page).offset(page * per_page)
        ids = [(r[0], r[1]) for r in query.all()]
        reviews = self._get_reviews_by_ids(ids)
        return PaginatedReviews(page=page, per_page=per_page,
                                total=total_count, reviews=reviews)

    def query_reviews_by_profile(self, owner: WalletID,
                                 page: int, per_page: int) -> PaginatedReviews:
        """
        Gets all the reviews from a profile as a query

        :param owner: the author of the review
        :param page: page of the reviews
        :param per_page: items per page
        :return: the paginated reviews
        """
        query = self.session.query(ReviewORM.id, ReviewORM.place_id). \
            filter(ReviewORM.owner == owner)
        total_count = query.count()
        query = query.limit(per_page).offset(page * per_page)
        ids = [(r[0], r[1]) for r in query.all()]
        reviews = self._get_reviews_by_ids(ids)
        return PaginatedReviews(page=page, per_page=per_page,
                                total=total_count, reviews=reviews)

    def query_places_by_profile(self, owner: WalletID,
                                page: int, per_page: int) -> PaginatedPlaces:
        """
        Gets all the places from a profile as a query

        :param owner: the creator of the place
        :param page: page of the reviews
        :param per_page: items per page
        :return: the paginated places
        """
        query = self.session.query(PlaceORM.id).filter(PlaceORM.owner == owner)
        total_count = query.count()
        query = query.limit(per_page).offset(page * per_page)
        places = self._get_places_by_ids([i[0] for i in query.all()])
        return PaginatedPlaces(page=page, per_page=per_page,
                               total=total_count, places=places)

    def add_image(self, filehash: str, pinned: bool = False,
                  score: float = 0.0) -> None:
        """
        Adds an image to the database
        :param filehash: hash of ipfs
        :param pinned: if the file is pinned
        :param score: image score
        """
        if self.session.query(ImageORM).get(filehash):
            return
        image_orm = ImageORM(hash=filehash, pinned=pinned)
        self.session.add(image_orm)
        self.session.commit()

    def get_review_image_hash(self, review_id: ReviewID,
                              place_id: PlaceID, image_number: int) -> Optional[str]:
        """
        Gets a review image hash

        :param review_id: the review id
        :param place_id: the place id
        :param image_number: the number of image
        :return: a filehash or None if the image does not exist
        """
        image_query = self.session.query(ReviewImageORM.hash). \
            join(ImageORM, ImageORM.hash == ReviewImageORM.hash).\
            filter(and_(ReviewImageORM.review_id == review_id, ReviewImageORM.place_id == place_id)).\
            order_by(ImageORM.created_at.asc()).offset(image_number - 1).limit(1).all()
        if not image_query:
            return None
        return image_query[0][0]

    def get_place_image_hash(self, place_id: PlaceID) -> Optional[str]:
        """
        Gets a place image hash
        :param place_id: the place id
        :return: the image bytes or None if there is no image
        """
        image_query = self.session.query(ReviewImageORM.hash). \
            join(ImageORM, ImageORM.hash == ReviewImageORM.hash).\
            filter(ReviewImageORM.place_id == place_id).\
            order_by(ImageORM.score.desc()).limit(1).all()
        if not image_query:
            return None
        return image_query[0][0]

    def add_rule(self, rule: RuleInput, is_initial_rule: bool = False):
        """
        Adds a rule to the database initializing it with the first state
        :param rule: the rule to insert
        :param is_initial_rule: if is the rule was originated in the deployment or not.
        :return:
        """
        proposed_at = datetime.utcfromtimestamp(rule.timestamp)
        rule_orm = RuleORM(rule_id=rule.rule_id, proposal_id=rule.proposal_id, proposer=rule.proposer,
                           rule_statement=rule.rule_statement, proposed_at=proposed_at,
                           rule_status=RuleStatus.EXECUTED, is_initial=is_initial_rule)
        self.session.add(rule_orm)
        self.session.commit()

