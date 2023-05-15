import { GeocodingResponse } from './response/geocoding';
import { Honduras4709GeocodingResponse, HondurasGeocodingResponse } from './mocks/geocoding';
import {UserResponse} from "./response/user";
import {GianUserResponse, MatiUserResponse, UriUserResponse} from "./mocks/user";

const searchTextHondurasResponse = ['Honduras', 'Honduras ', 'Honduras 4', 'Honduras 47', 'Honduras 470'];

class MockApiAdapter {
    async getGeocoding(physicalAddress: string, _: string): Promise<GeocodingResponse> {
        switch (true) {
            case searchTextHondurasResponse.includes(physicalAddress): {
                return HondurasGeocodingResponse;
            }
            case physicalAddress === 'Honduras 4709': {
                return Honduras4709GeocodingResponse;
            }
            default:
                return {
                    results: [],
                };
        }
    }

    async getUser(wallet: string): Promise<UserResponse> {
        switch (wallet) {
            case "mati-404": {
                return MatiUserResponse;
            }
            case "uri-200": {
                return UriUserResponse;
            }
            case "gian-200": {
                return GianUserResponse;
            }
        }
    }
}

const mockApiAdapter = new MockApiAdapter();

export { mockApiAdapter };
