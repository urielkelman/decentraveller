from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from src.api_models.bulk_results import PaginatedReviews
from src.api_models.place import PlaceID
from src.api_models.profile import WalletID, wallet_id_validator
from src.api_models.review import ReviewInDB, ReviewID, ReviewBody, ReviewWithProfile
from src.dependencies.indexer_auth import indexer_auth
from src.dependencies.push_notification_adapter import build_notification_adapter, NotificationAdapter
from src.dependencies.relational_database import build_relational_database, RelationalDatabase

review_router = InferringRouter()


@cbv(review_router)
class ReviewCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    push_notification_adapter: NotificationAdapter = Depends(build_notification_adapter)

    @review_router.post("/review", status_code=201, dependencies=[Depends(indexer_auth)])
    def create_review(self, review: ReviewBody) -> ReviewInDB:
        """
        Creates a new review in the database

        :param review: the review data for creation
        :return: the review data
        """
        try:
            inserted_review = self.database.add_review(review)
            place_from_review = self.database.query_places(inserted_review.place_id)
            place_owner = self.database.get_profile_orm(place_from_review.owner)
            inserted_review_owner = self.database.get_profile_orm(inserted_review.owner)
            self.push_notification_adapter.send_new_review_on_place(
                token=place_owner.push_token,
                place_name=place_from_review.name,
                writer_nickname=inserted_review_owner.nickname,
                place_id=place_from_review.id,
                place_score=place_from_review.score,
                address=place_from_review.address,
                reviews=place_from_review.reviews
            )
            return inserted_review
        except IntegrityError:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="Either the place or the profile does not exist")

    @review_router.get("/review")
    def get_review(self, review_id: ReviewID, place_id: PlaceID) -> ReviewWithProfile:
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

    @review_router.get("/profile/{owner}/reviews")
    def get_review_by_profile(self, per_page: int, page: int,
                              owner: WalletID = Depends(wallet_id_validator)) -> PaginatedReviews:
        """
        Gets a user reviews paginated

        :param owner: the profile
        :param per_page: items per page
        :param page: number of page
        :return: the reviews data
        """

        reviews = self.database.query_reviews_by_profile(owner, page, per_page)
        if not reviews:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return reviews
