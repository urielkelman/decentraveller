from typing import Optional, List
from sqlalchemy.orm import Session
from src.api_models.place import PlaceID
from src.orms.place import PlaceORM
from src.orms.profile import ProfileORM
from src.api_models.review import ReviewId
from src.orms.review import ReviewORM



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

    def query_place(self, place_id: PlaceID) -> Optional[PlaceORM]:
        """
        Gets a place from the database by its id

        :param place_id: the item id
        :return: a place ORM or None if the id does not exist
        """
        place: Optional[PlaceORM] = self.session.query(PlaceORM).get(place_id)

        return place

    def query_profile(self,
                      owner: str) -> Optional[ProfileORM]:
        """
        Database querying for a profile

        :param owner: the owner of the profile

        :return: a ProfileORM or none if missing
        """
        profile: Optional[ProfileORM] = self.session.query(ProfileORM).get(owner)
        return profile

    def query_review(self, review_id: ReviewId) -> Optional[ReviewORM]:
        """
        Gets a review from the database by its id

        :param review_id: the id
        :return: a review ORM or None if the id does not exist
        """
        review: Optional[ReviewORM] = self.session.query(ReviewORM).get(review_id)

        return review

    def query_reviews_by_place(self, place_id: PlaceID,
                               page: int, per_page: int) -> List[ReviewORM]:
        """
        Gets all the reviews from a place as a query

        :param place_id: the id of the place
        :param page: page of the reviews
        :param per_page: items per page
        :return: a query with the result
        """
        query = self.session.query(ReviewORM).filter(ReviewORM.place_id == place_id)
        query = query.limit(per_page).offset(page * per_page)
        return query.all()