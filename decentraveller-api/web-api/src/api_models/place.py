from typing import NewType, Union, Optional, Dict, Any

from fastapi_utils.api_model import APIModel

PlaceID = NewType("PlaceId", int)


class PlaceBody(APIModel):
    """
    Place API Model
    """
    name: str
    address: str
    latitude: Optional[float]
    longitude: Optional[float]
    categories: Optional[str]
    sub_categories: Optional[str]


class PlaceUpdate(APIModel):
    """
    Place API Model
    """
    name: Union[str, None]
    address: Union[str, None]
    latitude: Union[float, None]
    longitude: Union[float, None]
    categories: Union[str, None]
    sub_categories: Union[str, None]


class PlaceInDB(PlaceBody):
    """
    Place API Model
    """
    id: PlaceID
