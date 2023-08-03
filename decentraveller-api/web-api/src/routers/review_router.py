from fastapi import Depends, HTTPException, Response
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from src.api_models.bulk_results import PaginatedReviews
from src.api_models.place import PlaceID
from src.api_models.profile import WalletID, wallet_id_validator
from src.api_models.review import ReviewID, ReviewInput, ReviewWithProfile
from src.dependencies.indexer_auth import indexer_auth
from src.dependencies.ipfs_service import IPFSService
from src.dependencies.relational_database import build_relational_database, RelationalDatabase

review_router = InferringRouter()


@cbv(review_router)
class ReviewCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    ipfs_controller: IPFSService = Depends(IPFSService)

    @review_router.post("/review", status_code=201, dependencies=[Depends(indexer_auth)])
    def create_review(self, review: ReviewInput) -> ReviewWithProfile:
        """
        Creates a new review in the database

        :param review: the review data for creation
        :return: the review data
        """
        for h in review.images:
            self.ipfs_controller.pin_file(h)
        try:
            r = self.database.add_review(review)
        except IntegrityError as e:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="Either the place or the profile does not exist")
        return r

    @review_router.get("/review")
    def get_review(self, id: ReviewID, place_id: PlaceID) -> ReviewWithProfile:
        """
        Get a review by its id

        :param id: the review id to query
        :param place_id: the place id
        :return: the review data
        """
        review = self.database.query_review(id, place_id)
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

    @review_router.get("/review/{image_number}.jpg")
    def get_review_image(self, id: ReviewID,
                         place_id: PlaceID,
                         image_number: int):
        """
        Gets a review image

        :param id: the review id to query
        :param place_id: the place id
        :param image_number: the number of the imave
        :return: jpg image
        """
        image_hash = self.database.get_review_image_hash(id, place_id, image_number)
        if image_hash is None:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        image_bytes = self.ipfs_controller.get_file(image_hash)
        return Response(content=image_bytes,
                        media_type="image/jpeg")
