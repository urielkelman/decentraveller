from typing import NewType, Union, Optional, Dict, Any

from fastapi_utils.api_model import APIModel

PlaceID = NewType("PlaceId", int)


class PlaceBody(APIModel):
    """
    Place API Model
    """
    name: str
    address: Optional[str]
    latitude: float
    longitude: float
    open_hours: Optional[Dict[str, Any]]
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
    open_hours: Union[Dict[str, Any], None]
    categories: Union[str, None]
    sub_categories: Union[str, None]


class PlaceInDB(PlaceUpdate):
    """
    Place API Model
    """
    id: PlaceID
