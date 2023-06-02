import { GeocodingResponse } from './response/geocoding';
import { Honduras4709GeocodingResponse, HondurasGeocodingResponse } from './mocks/geocoding';
import { UserResponse } from './response/user';
import { GianUserResponse, MatiUserResponse, UriUserResponse } from './mocks/user';
import { PlacesResponse } from './response/places';
import Adapter from './Adapter';
import { defaultPlacesMock } from './mocks/places';

const searchTextHondurasResponse = ['Honduras', 'Honduras ', 'Honduras 4', 'Honduras 47', 'Honduras 470'];

class MockApiAdapter extends Adapter {
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
                return null;
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

    async getMyPlacesPlaces(walletAddress: string): Promise<PlacesResponse> {
        return {
            results: [
                {
                    id: 1,
                    name: 'Eretz',
                    address: 'Honduras 4709, Palermo, Buenos Aires, C1414, Argentina',
                    latitude: '-34.590716',
                    longitude: '-58.427125',
                    category: 'GASTRONOMY',
                    score: 4.8,
                    reviewCount: 25,
                },
            ],
        };
    }

    async getRecommendedPlacesForAddress(
        walletAddress: string,
        [latitude, longitude]: [string?, string?]
    ): Promise<PlacesResponse> {
        return defaultPlacesMock;
    }

    async getRecommendedPlaces(_): Promise<PlacesResponse> {
        return defaultPlacesMock;
    }
}

const mockApiAdapter = new MockApiAdapter();

export { mockApiAdapter };
