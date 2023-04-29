from typing import List

from fastapi_utils.api_model import APIModel


class ForwardGeoCodingResult(APIModel):
    """
    One geo coding result
    """
    full_address: str
    longitude: str
    latitude: str


class ForwardGeoCodingResults(APIModel):
    """
    Forward GeoCoding API Model
    """
    results: List[ForwardGeoCodingResult]
