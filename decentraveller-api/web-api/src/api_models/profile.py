from datetime import datetime
from fastapi_utils.api_model import APIModel
from src.api_models.place import PlaceCategory

class ProfileBody(APIModel):
    """
    Profile body API Model
    """
    owner: str
    nickname: str
    country: str
    interest: PlaceCategory


class ProfileInDB(ProfileBody):
    """
    Profile DB API Model
    """
    created_at: datetime
