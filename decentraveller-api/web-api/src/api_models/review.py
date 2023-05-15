from typing import NewType

from fastapi_utils.api_model import APIModel

from src.api_models.place import PlaceID

ReviewId = NewType("ReviewId", int)


class ReviewBody(APIModel):
    """
    Review API Model
    """
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
    id: ReviewId
