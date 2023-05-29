from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from src.api_models.place import PlaceID
from src.api_models.review import ReviewInDB, ReviewID, ReviewBody
from src.api_models.bulk_results import PaginatedReviews
from src.dependencies.relational_database import build_relational_database, RelationalDatabase
from sqlalchemy.exc import IntegrityError

review_router = InferringRouter()


@cbv(review_router)
class ReviewCBV:
    database: RelationalDatabase = Depends(build_relational_database)

    @review_router.post("/review", status_code=201)
    def create_review(self, review: ReviewBody) -> ReviewInDB:
        """
        Creates a new review in the database

        :param review: the review data for creation
        :return: the review data
        """
        try:

            return self.database.add_review(review)
        except IntegrityError as e:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="Either the place or the profile does not exist")

    @review_router.get("/review")
    def get_review(self, review_id: ReviewID, place_id: PlaceID) -> ReviewInDB:
        """
        Get a review by its id

        :param review_id: the review id to query
        :param place_id: the place id
        :return: the review data
        """
        review = self.database.query_review(review_id, place_id)
        if review is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return review

    @review_router.get("/place/{place_id}/reviews")
    def get_review_by_place(self, place_id: PlaceID,
                            per_page: int, page: int) -> PaginatedReviews:
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
        return reviews
