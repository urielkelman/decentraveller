import {GeocodingResponse} from "./response/geocoding";
import HttpConnector from "../connectors/HttpConnector";

class ApiAdapter {
    private baseUrl: string
    private httpConnector: HttpConnector

    constructor(baseUrl: string, httpConnector: HttpConnector) {
        this.baseUrl = baseUrl;
        this.httpConnector = httpConnector;
    }

    async getGeocoding(physicalAddress: string, country: string): GeocodingResponse {

    }
}