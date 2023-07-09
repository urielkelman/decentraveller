from typing import Optional, Dict, List, Union, Callable

from sqlalchemy import func
from sqlalchemy.orm import Session

from src.api_models.bulk_results import PaginatedReviews, PaginatedPlaces
from src.api_models.place import PlaceID, PlaceInDB, PlaceWithStats
from src.api_models.profile import WalletID
from src.api_models.review import ReviewID, ReviewInDB, ReviewBody
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

    def query_review(self, review_id: ReviewID, place_id: PlaceID) -> Optional[ReviewInDB]:
        """
        Gets a review from the database by its id

        :param review_id: the review id
        :param place_id: the place id
        :return: a review ORM or None if the id does not exist
        """
        review: Optional[ReviewORM] = self.session.query(ReviewORM).get((review_id, place_id))
        if not review:
            return None
        return ReviewInDB.from_orm(review)

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
                        owner: WalletID) -> Optional[ProfileORM]:
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
        query = self.session.query(ReviewORM).filter(ReviewORM.place_id == place_id)
        total_count = query.count()
        query = query.limit(per_page).offset(page * per_page)
        reviews = [ReviewInDB.from_orm(r) for r in query.all()]
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
        query = self.session.query(ReviewORM).filter(ReviewORM.owner == owner)
        total_count = query.count()
        query = query.limit(per_page).offset(page * per_page)
        reviews = [ReviewInDB.from_orm(r) for r in query.all()]
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
