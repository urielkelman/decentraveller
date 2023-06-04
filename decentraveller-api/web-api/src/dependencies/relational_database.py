from typing import Optional, Dict, List, Union, Callable, Tuple

from sqlalchemy import func, tuple_
from sqlalchemy.orm import Session

from src.api_models.bulk_results import PaginatedReviews, PaginatedPlaces
from src.api_models.place import PlaceID, PlaceInDB, PlaceWithStats
from src.api_models.review import ReviewID, ReviewInDB, ReviewBody, ReviewWithProfile
from src.api_models.profile import ProfileInDB
from src.orms.place import PlaceORM
from src.orms.profile import ProfileORM
from src.orms.review import ReviewORM


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
                               stars=p[1], reviews=p[2])
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
        parsed_result = []
        for p in result:
            review = ReviewInDB.from_orm(p[0]).dict()
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
                              stars=None, reviews=0)

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

    def add_review(self, review: ReviewBody):
        """
        Adds a review to the database
        :param review: the review data to add
        :return:
        """
        review_orm = ReviewORM(id=review.id, place_id=review.place_id,
                               score=review.score, owner=review.owner,
                               text=review.text, images=review.images,
                               state=review.state)
        self.session.add(review_orm)
        self.session.commit()
        return ReviewInDB.from_orm(review_orm)

    def get_profile_orm(self,
                        owner: str) -> Optional[ProfileORM]:
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
        query = self.session.query(ReviewORM.id, ReviewORM.place_id).\
            filter(ReviewORM.place_id == place_id)
        total_count = query.count()
        query = query.limit(per_page).offset(page * per_page)
        ids = [(r[0], r[1]) for r in query.all()]
        reviews = self._get_reviews_by_ids(ids)
        return PaginatedReviews(page=page, per_page=per_page,
                                total=total_count, reviews=reviews)

    def query_reviews_by_profile(self, owner: str,
                                 page: int, per_page: int) -> PaginatedReviews:
        """
        Gets all the reviews from a profile as a query

        :param owner: the author of the review
        :param page: page of the reviews
        :param per_page: items per page
        :return: the paginated reviews
        """
        query = self.session.query(ReviewORM.id, ReviewORM.place_id).\
            filter(ReviewORM.owner == owner)
        total_count = query.count()
        query = query.limit(per_page).offset(page * per_page)
        ids = [(r[0], r[1]) for r in query.all()]
        reviews = self._get_reviews_by_ids(ids)
        return PaginatedReviews(page=page, per_page=per_page,
                                total=total_count, reviews=reviews)

    def query_places_by_profile(self, owner: str,
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
