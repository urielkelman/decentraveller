from typing import List
from fastapi_utils.api_model import APIModel
from src.api_models.review import ReviewInDB


class PaginatedReviews(APIModel):
    """
    Paginated reviews model
    """
    total: int
    page: int
    per_page: int
    reviews: List[ReviewInDB]