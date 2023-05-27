from fastapi_utils.api_model import APIModel
from src.api_models.place import PlaceCategory


class ProfileInDB(APIModel):
    """
    Profile API Model
    """
    owner: str
    nickname: str
    country: str
    interest: PlaceCategory
