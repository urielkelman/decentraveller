from typing import Optional, Dict, List, Union
from sqlalchemy.orm import Session
from src.api_models.place import PlaceID, PlaceInDB, PlaceWithStats
from src.orms.place import PlaceORM
from src.orms.profile import ProfileORM
from src.api_models.review import ReviewId, ReviewInDB, ReviewBody
from src.orms.review import ReviewORM
from src.api_models.bulk_results import PaginatedReviews
from sqlalchemy import func


class RelationalDatabase:
    """
    Relational Database object
    """
    session: Optional[Session]

    def __init__(self):
        from src.database.session import SessionLocal

        self._session = SessionLocal()

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

    def query_review(self, review_id: ReviewId) -> Optional[ReviewInDB]:
        """
        Gets a review from the database by its id

        :param review_id: the id
        :return: a review ORM or None if the id does not exist
        """
        review: Optional[ReviewORM] = self.session.query(ReviewORM).get(review_id)
        if not review:
            return None
        return ReviewInDB.from_orm(review)

    def add_review(self, review: ReviewBody):
        """
        Adds a review to the database
        :param review: the review data to add
        :return:
        """
        review_orm = ReviewORM(place_id=review.place_id,
                               score=review.score, owner=review.owner,
                               text=review.text, images=review.images,
                               state=review.state)
        self.session.add(review_orm)
        self.session.commit()
        return ReviewInDB.from_orm(review_orm)

    def query_reviews_by_place(self, place_id: PlaceID,
                               page: int, per_page: int) -> PaginatedReviews:
        """
        Gets all the reviews from a place as a query

        :param place_id: the id of the place
        :param page: page of the reviews
        :param per_page: items per page
        :return: a query with the result
        """
        query = self.session.query(ReviewORM).filter(ReviewORM.place_id == place_id)
        total_count = query.count()
        query = query.limit(per_page).offset(page * per_page)
        reviews = [ReviewInDB.from_orm(r) for r in query.all()]
        return PaginatedReviews(page=page, per_page=per_page,
                                total=total_count, reviews=reviews)

    def get_profile_orm(self,
                        owner: str) -> Optional[ProfileORM]:
        """
        Database querying for a profile

        :param owner: the owner of the profile

        :return: a ProfileORM or none if missing
        """
        profile: Optional[ProfileORM] = self.session.query(ProfileORM).get(owner)
        return profile