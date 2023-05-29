from typing import NewType
from datetime import datetime

from fastapi_utils.api_model import APIModel

from src.api_models.place import PlaceID

ReviewID = NewType("ReviewId", int)

class ReviewBody(APIModel):
    """
    Review API Model
    """
    id: ReviewID
    place_id: PlaceID
    score: int
    owner: str
    text: str
    images: list[str]
    state: str

class ReviewInDB(ReviewBody):
    """
    Review API Model
    """
    created_at: datetime