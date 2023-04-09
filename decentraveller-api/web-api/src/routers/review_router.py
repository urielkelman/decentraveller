from typing import Optional, List

from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.orm import Session, Query
from starlette.status import HTTP_404_NOT_FOUND

from src.api_models.place import PlaceID
from src.api_models.review import ReviewInDB, ReviewId
from src.deps import get_db
from src.orms.review import ReviewORM

review_router = InferringRouter()


@cbv(review_router)
class ReviewCBV:
    session: Session = Depends(get_db)

    @staticmethod
    def query_review(session: Session, review_id: ReviewId) -> Optional[ReviewORM]:
        """
        Gets a review from the database by its id
        
        :param session: the database session
        :param review_id: the id
        :return: a review ORM or None if the id does not exist
        """
        review: Optional[ReviewORM] = session.query(ReviewORM).get(review_id)

        return review

    @staticmethod
    def query_reviews_by_place(session: Session, place_id: PlaceID) -> Query:
        """
        Gets all the reviews from a place as a query

        :param session: the database session
        :param place_id: the id of the place
        :return: a query with the result
        """
        query = session.query(ReviewORM).filter(ReviewORM.place_id == place_id)

        return query

    @review_router.post("/review", status_code=201)
    def create_review(self, review: ReviewInDB) -> ReviewInDB:
        """
        Creates a new review in the database

        :param review: the review data for creation
        :return: the place data
        """
        review_orm = ReviewORM(id=review.id, place_id=review.place_id,
                               score=review.score, owner=review.owner,
                               text=review.text, images=review.images,
                               state=review.state)
        self.session.add(review_orm)
        self.session.commit()
        return ReviewInDB.from_orm(review_orm)

    @review_router.get("/review/{review_id}")
    def get_review(self, review_id: ReviewId) -> ReviewInDB:
        """
        Get a review by its id

        :param review_id: the review id to query
        :return: the review data
        """
        review_orm = self.query_review(self.session, review_id)
        if review_orm is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return ReviewInDB.from_orm(review_orm)

    @review_router.get("/place/{place_id}/reviews")
    def get_review_by_place(self, place_id: PlaceID,
                            per_page: int, page: int) -> List[ReviewInDB]:
        """
        Get a place reviews paginated

        :param place_id: the place id to query
        :param per_page: items per page
        :param page: number of page
        :return: the reviews data
        """
        query = self.query_reviews_by_place(self.session, place_id)
        query = query.limit(per_page).offset(page * per_page)
        reviews = self.session.execute(query).all()
        if not reviews:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return [ReviewInDB.from_orm(r[0]) for r in reviews]
