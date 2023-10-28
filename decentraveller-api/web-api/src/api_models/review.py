from typing import NewType
from datetime import datetime

from fastapi_utils.api_model import APIModel
from pydantic import validator

from src.api_models.place import PlaceID
from src.api_models.profile import ProfileInDB
from src.api_models.profile import WalletID, wallet_id_validator
from src.api_models.rule import RuleId
from src.orms.review import ReviewStatus

ReviewID = NewType("ReviewId", int)


class ReviewBody(APIModel):
    """
    Review API Model
    """
    id: ReviewID
    place_id: PlaceID
    score: int
    owner: WalletID
    text: str

    @validator('owner')
    def wallet_id_validator(cls, v):
        return wallet_id_validator(v)


class ReviewInput(ReviewBody):
    """
    Review input API
    """
    images: list[str]


class ReviewInDB(ReviewBody):
    """
    Review API Model
    """
    image_count: int
    created_at: datetime
    status: ReviewStatus


class ReviewWithProfile(ReviewInDB):
    """
    Review with profile
    """
    owner: ProfileInDB

    @validator('owner')
    def wallet_id_validator(cls, v):
        assert isinstance(v, ProfileInDB)
        return v


class CensorReviewInput(APIModel):
    review_id: ReviewID
    place_id: PlaceID
    broken_rule_id: RuleId
    moderator: WalletID

    @validator('moderator')
    def wallet_id_validator(cls, v):
        return wallet_id_validator(v)
