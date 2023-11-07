from fastapi import Depends, HTTPException, Response
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from sqlalchemy.exc import IntegrityError
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from src.api_models.bulk_results import PaginatedReviews
from src.api_models.place import PlaceID
from src.api_models.profile import WalletID, wallet_id_validator
from src.api_models.review import ReviewID, ReviewInput, ReviewWithProfile, CensorReviewInput, \
    ReviewChallengeCensorshipInput, UncensorReviewInput
from src.dependencies.indexer_auth import indexer_auth
from src.dependencies.ipfs_service import IPFSService
from src.dependencies.push_notification_adapter import PushNotificationAdapter
from src.dependencies.relational_database import build_relational_database, RelationalDatabase

review_router = InferringRouter()


@cbv(review_router)
class ReviewCBV:
    database: RelationalDatabase = Depends(build_relational_database)
    ipfs_service: IPFSService = Depends(IPFSService)
    push_notification_adapter: PushNotificationAdapter = Depends(PushNotificationAdapter)

    @review_router.post("/review", status_code=201, dependencies=[Depends(indexer_auth)])
    def create_review(self, review: ReviewInput) -> ReviewWithProfile:
        """
        Creates a new review in the database

        :param review: the review data for creation
        :return: the review data
        """
        for h in review.images:
            self.ipfs_service.pin_file(h)
        try:
            inserted_review = self.database.add_review(review)
        except IntegrityError:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST,
                                detail="Either the place or the profile does not exist")
        place_from_review = self.database.query_places(inserted_review.place_id)
        place_owner = self.database.get_profile_orm(place_from_review.owner)
        inserted_review_owner = inserted_review.owner
        self.push_notification_adapter.send_new_review_on_place(
            token=place_owner.push_token,
            place=place_from_review,
            writer_nickname=inserted_review_owner.nickname,
        )
        return inserted_review

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

        reviews = self.database.query_active_reviews_by_place(place_id, page, per_page)
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

        reviews = self.database.query_active_reviews_by_profile(owner, page, per_page)
        if not reviews:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return reviews

    @review_router.get("/profile/{owner}/reviews/censored")
    def get_censored_reviews_by_profile(self, per_page: int, page: int,
                                        owner: WalletID = Depends(wallet_id_validator)) -> PaginatedReviews:
        """
        Gets the censored reviews from a user paginated

        :param owner: the profile
        :param per_page: items per page
        :param page: number of page
        :return: the reviews data
        """

        reviews = self.database.query_censored_reviews_by_profile(owner, page, per_page)
        if not reviews:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return reviews

    @review_router.get("/reviews/censored")
    def get_censored_reviews(self, per_page: int, page: int) -> PaginatedReviews:
        """
        Gets the censored reviews

        :param per_page: items per page
        :param page: number of page
        :return: the reviews data
        """

        reviews = self.database.query_censored_reviews(page, per_page)
        if not reviews:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND)
        return reviews

    @review_router.get("/reviews/as_juror")
    def get_as_juror_reviews(self, juror: WalletID, per_page: int, page: int) -> PaginatedReviews:
        """
        Gets the reviews on which juror is a juror

        :param juror: the juror of the review
        :param per_page: items per page
        :param page: number of page
        :return: the reviews data
        """

        reviews = self.database.query_as_juror_reviews(juror, page, per_page)
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
        image_bytes = self.ipfs_service.get_file(image_hash)
        return Response(content=image_bytes,
                        media_type="image/jpeg")

    @review_router.post("/review/censor", status_code=201, dependencies=[Depends(indexer_auth)])
    def censor_review(self, censor_review_input: CensorReviewInput):
        """
        Change the status of the review to censored.
        :param censor_review_input: the object containing the information of the review to censor.
        """
        self.database.censor_review(censor_review_input)
        review = self.database.get_review(censor_review_input.place_id, censor_review_input.review_id)

        owner = self.database.get_profile_orm(review.owner)
        if owner.push_token:
            self.push_notification_adapter.send_review_censored(owner.push_token,
                                                                censor_review_input.place_id,
                                                                censor_review_input.review_id)
        return

    @review_router.post("/review/censor/challenge", status_code=201, dependencies=[Depends(indexer_auth)])
    def challenge_review_censorship(self, challenge_censorship_input: ReviewChallengeCensorshipInput):
        """
        Updates a review indicating that the censorship was challenged.
        :param challenge_censorship_input: the object containing the information of the challenge.
        """
        self.database.challenge_review_censorship(challenge_censorship_input)

        for juror in challenge_censorship_input.juries:
            juror_orm = self.database.get_profile_orm(juror)
            if juror_orm.push_token:
                self.push_notification_adapter.send_notify_juror(juror_orm.push_token,
                                                                 challenge_censorship_input.place_id,
                                                                 challenge_censorship_input.review_id)
        return

    @review_router.post("/review/uncensor", status_code=201, dependencies=[Depends(indexer_auth)])
    def uncensor_review(self, uncensor_review_input: UncensorReviewInput):
        """
        Updates a review to non-censored status.
        """
        self.database.uncensor_review(uncensor_review_input)
        review = self.database.get_review(uncensor_review_input.place_id, uncensor_review_input.review_id)

        owner = self.database.get_profile_orm(review.owner)
        if owner.push_token:
            self.push_notification_adapter.send_review_uncensored(owner.push_token,
                                                                  uncensor_review_input.place_id,
                                                                  uncensor_review_input.review_id)
        return