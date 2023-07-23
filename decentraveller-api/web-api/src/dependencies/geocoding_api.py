import os
from typing import NamedTuple, List, Optional

import requests

FORWARD_GEOCODING_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json"
ALLOWED_PLACE_TYPES = {'address', 'poi'}


class GeoCodingAPIError(RuntimeError):
    """
    The geocoding API is not working
    """
    pass


class GeoLocationNotFound(AttributeError):
    """
    The geocoding API is not working
    """
    pass


class GeoCodedLocation(NamedTuple):
    """
    Geo coded location
    """
    full_address: str
    latitude: float
    longitude: float


class GeoCodingAPI:
    """
    Geo coding API
    """

    def __init__(self):
        # self.api_key = os.getenv('MAPBOX_API_KEY')
        self.api_key = 'pk.eyJ1IjoidXJpenRlayIsImEiOiJjbGd2cHk2ZGIwNDgxM2RxdHB2bno0bHh2In0.3yedjB2istGKYvbkTOYp9g'

    def forward_geocoding(self, address: str, country: Optional[str]) -> List[GeoCodedLocation]:
        """
        Forward geocoding
        :param address: the address
        :param country: ISO 3166-1 alpha-2 country code
        :return: a tuple for longitude and latitude
        """
        query_params = {'limit': 10, 'access_token': self.api_key}
        if country:
            query_params['country'] = country
        try:
            r = requests.get(FORWARD_GEOCODING_ENDPOINT.format(address=address),
                             params=query_params)
            if r.status_code == 404:
                raise GeoLocationNotFound
            r.raise_for_status()
            result = [p for p in r.json()['features']
                      if set(p['place_type']) & ALLOWED_PLACE_TYPES]
            object_result = []
            for r in result:
                object_result.append(GeoCodedLocation(full_address=r['place_name'],
                                                      longitude=r['center'][0],
                                                      latitude=r['center'][1]))
            return object_result
        except Exception:
            raise GeoCodingAPIError
