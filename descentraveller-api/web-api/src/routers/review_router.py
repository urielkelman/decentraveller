from typing import Optional

from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.orm import Session
from starlette.status import HTTP_404_NOT_FOUND

from src.api_models.place import ReviewInDB, ReviewBody, ReviewId
from src.orms.place import ReviewORM
from src.deps import get_db

review_router = InferringRouter()


@cbv(review_router)
class ReviewCBV:
    session: Session = Depends(get_db)

    @staticmethod
    def query_place(session: Session, review_id: ReviewId) -> Optional[ReviewORM]:
        """
        Gets a place from the database by its id
        
        :param session: the database session
        :param review_id: the id
        :return: a review ORM or None if the id does not exist
        """
        place: Optional[ReviewORM] = session.query(ReviewORM).get(review_id)

        return place

    @review_router.post("/review")
    def create_place(self, review: ReviewInDB) -> ReviewInDB:
        """
        Creates a new place in the database

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
    def get_place(self, review_id: ReviewId) -> ReviewInDB:
        """
        Get a review by its id

        :param review_id: the review id to query
        :return: the review data
        """
        review_orm = self.query_place(self.session, review_id)
        if review_orm is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return ReviewInDB.from_orm(review_orm)
