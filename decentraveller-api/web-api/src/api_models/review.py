from typing import NewType
from datetime import datetime

from fastapi_utils.api_model import APIModel
from pydantic import validator

from src.api_models.place import PlaceID
from src.api_models.profile import WalletID, wallet_id_validator


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
    images: list[str]
    state: str

    @validator('owner')
    def wallet_id_validator(cls, v):
        return wallet_id_validator(v)

class ReviewInDB(ReviewBody):
    """
    Review API Model
    """
    created_at: datetime