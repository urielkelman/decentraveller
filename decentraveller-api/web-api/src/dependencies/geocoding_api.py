from typing import Tuple, Optional
import requests
import os

FORWARD_GEOCODING_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json?access_token={api_key}" \
                             "&limit=1"


class GeoCodingAPIError(RuntimeError):
    """
    The geocoding API is not working
    """
    pass


class GeoCodingAPI:
    """
    Geo coding API
    """
    def __init__(self):
        self.api_key = os.getenv('MAPBOX_API_KEY')

    def forward_geocoding(self, address: str) -> Tuple[float, float]:
        """
        Forward geocoding
        :param address: the address
        :return: a tuple for longitude and latitude
        """
        try:
            r = requests.get(FORWARD_GEOCODING_ENDPOINT.format(address=address, api_key=self.api_key))
            r.raise_for_status()
            result = r.json()['features'][0]
            return result['center'][0], result['center'][1]
        except Exception:
            raise GeoCodingAPIError