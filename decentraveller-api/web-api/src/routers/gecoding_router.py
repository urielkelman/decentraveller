from fastapi import Depends, HTTPException
from fastapi_utils.cbv import cbv
from fastapi_utils.inferring_router import InferringRouter
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR, HTTP_404_NOT_FOUND

from src.api_models.geocoding import ForwardGeoCodingResults, ForwardGeoCodingResult
from src.dependencies.geocoding_api import GeoCodingAPI, GeoCodingAPIError, GeoLocationNotFound

geocoding_router = InferringRouter()


@cbv(geocoding_router)
class GeocodingCBV:
    geocoding_api: GeoCodingAPI = Depends(GeoCodingAPI)

    @geocoding_router.get("/geocoding/forward")
    def forward_geocoding(self, address: str,1 country: str) -> ForwardGeoCodingResults:
        """
        Forward geocoding

        :param address: the address to search
        :param country: the ISO 3166-1 alpha-2 country
        :return: result of the search
        """
        try:
            points = self.geocoding_api.        forward_geocoding(address, country)
        except GeoCodingAPIError:
            raise HTTPException(HTTP_500_INTERNAL_SERVER_ERROR,
                                "The geocoding service is not working."
                                "Try again later or contact an administrator.")
        except GeoLocationNotFound:
            raise HTTPException(HTTP_404_NOT_FOUND,
                                "Location not found.")
        return ForwardGeoCodingResults(results=[ForwardGeoCodingResult(full_address=p.full_address,
                                                                       longitude=str(p.longitude),
                                                                       latitude=str(p.latitude))
                                                for p in points])
