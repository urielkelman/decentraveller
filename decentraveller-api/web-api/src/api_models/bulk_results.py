from typing import List, Union
from fastapi_utils.api_model import APIModel
from src.api_models.review import ReviewWithProfile
from src.api_models.place import PlaceWithStats, PlaceWithDistance


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
    reviews: List[ReviewWithProfile]


class PaginatedPlaces(PaginatedResultBase):
    """
    Paginated reviews model
    """
    places: List[PlaceWithStats]

class PaginatedPlacesWithDistance(PaginatedResultBase):
    """
    Paginated reviews model
    """
    places: List[PlaceWithDistance]
