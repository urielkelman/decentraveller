from typing import NewType, Union, Optional, Dict, Any
from src.orms.place import PlaceId
from fastapi_utils.api_model import APIModel

ReviewId = NewType("ReviewId", int)


class ReviewBody(APIModel):
    """
    Review API Model
    """
    place_id: PlaceId
    score: int
    owner: str
    text: str
    images: Dict[str, Any]
    state: str


class ReviewInDB(ReviewBody):
    """
    Review API Model
    """
    id: ReviewId
