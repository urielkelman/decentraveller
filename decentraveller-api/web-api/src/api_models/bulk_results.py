from typing import List
from fastapi_utils.api_model import APIModel
from src.api_models.review import ReviewInDB
from src.api_models.place import PlaceWithStats


class PaginatedResultBase(APIModel):
    """
    Paginated results base class
    """
    total: int
    page: int
    per_page: int


class PaginatedReviews(PaginatedResultBase):
    """
    Paginated reviews model
    """
    reviews: List[ReviewInDB]


class PaginatedPlaces(PaginatedResultBase):
    """
    Paginated reviews model
    """
    places: List[PlaceWithStats]