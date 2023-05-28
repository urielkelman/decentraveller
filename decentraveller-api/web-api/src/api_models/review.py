from typing import NewType

from fastapi_utils.api_model import APIModel

from src.api_models.place import PlaceID

ReviewID = NewType("ReviewId", int)


class ReviewInDB(APIModel):
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