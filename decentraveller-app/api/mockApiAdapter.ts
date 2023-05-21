import { GeocodingResponse } from './response/geocoding';
import { Honduras4709GeocodingResponse, HondurasGeocodingResponse } from './mocks/geocoding';
import { UserResponse } from './response/user';
import { GianUserResponse, MatiUserResponse, UriUserResponse } from './mocks/user';

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

    async getUser(wallet: string, onFailed: () => void): Promise<UserResponse> {
        switch (wallet) {
            case 'mati': {
                return null
            }
            case 'uri': {
                return UriUserResponse;
            }
            case 'gian': {
                return GianUserResponse;
            }
            case '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5': {
                return UriUserResponse;
            }
        }
    }
}

const mockApiAdapter = new MockApiAdapter();

export { mockApiAdapter };
