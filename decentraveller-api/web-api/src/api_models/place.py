from typing import NewType, Union, Optional
from fastapi_utils.api_model import APIModel
from src.api_models.profile import WalletID, wallet_id_validator
from src.api_models.place_category import PlaceCategory
from pydantic import validator


PlaceID = NewType("PlaceId", int)


class PlaceBody(APIModel):
    """
    Place API Model
    """
    name: str
    address: str
    latitude: float
    longitude: float
    category: Optional[PlaceCategory]


class PlaceUpdate(APIModel):
    """
    Place API Model
    """
    name: Union[str, None]
    address: Union[str, None]
    latitude: Union[float, None]
    longitude: Union[float, None]
    category: Union[PlaceCategory, None]


class PlaceInDB(PlaceBody):
    """
    Place API Model
    """
    id: PlaceID
    owner: WalletID

    @validator('owner')
    def wallet_id_validator(cls, v):
        return wallet_id_validator(v)


class PlaceWithStats(PlaceInDB):
    """
    Place with stats
    """
    stars: Optional[float]
    reviews: int
