from typing import Optional, List

from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.orm import Session, Query
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from src.api_models.place import PlaceID
from src.api_models.review import ReviewInDB, ReviewId, ReviewBody
from src.dependencies.relational_database import RelationalDatabase
from src.orms.review import ReviewORM
from sqlalchemy.exc import IntegrityError

review_router = InferringRouter()


@cbv(review_router)
class ReviewCBV:
    database: RelationalDatabase = Depends(RelationalDatabase)

    @review_router.post("/review", status_code=201)
    def create_review(self, review: ReviewBody) -> ReviewInDB:
        """
        Creates a new review in the database

        :param review: the review data for creation
        :return: the review data
        """
        try:
            review_orm = ReviewORM(place_id=review.place_id,
                                   score=review.score, owner=review.owner,
                                   text=review.text, images=review.images,
                                   state=review.state)
            self.database.session.add(review_orm)
            self.database.session.commit()
            return ReviewInDB.from_orm(review_orm)
        except IntegrityError as e:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="Either the place or the profile does not exist")

    @review_router.get("/review/{review_id}")
    def get_review(self, review_id: ReviewId) -> ReviewInDB:
        """
        Get a review by its id

        :param review_id: the review id to query
        :return: the review data
        """
        review_orm = self.database.query_review(review_id)
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

        reviews = self.database.query_reviews_by_place(place_id, page, per_page)
        if not reviews:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return [ReviewInDB.from_orm(r) for r in reviews]
