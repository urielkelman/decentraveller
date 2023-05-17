from typing import NewType, Union, Optional
import enum
from fastapi_utils.api_model import APIModel

PlaceID = NewType("PlaceId", int)


class PlaceCategory(str, enum.Enum):
    """
    Categories for places
    """
    GASTRONOMY = "GASTRONOMY"
    ACCOMMODATION = "ACCOMMODATION"
    ENTERTAINMENT = "ENTERTAINMENT"


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
