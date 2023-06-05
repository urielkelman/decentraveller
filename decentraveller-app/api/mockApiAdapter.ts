import { GeocodingResponse } from './response/geocoding';
import { Honduras4709GeocodingResponse, HondurasGeocodingResponse } from './mocks/geocoding';
import { UserResponse } from './response/user';
import { GianUserResponse, MatiUserResponse, UriUserResponse } from './mocks/user';
import { PlacesResponse } from './response/places';
import {ReviewsResponse} from "./response/reviews";

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

    async getRecommendedPlaces(walletAddress: string): Promise<PlacesResponse> {
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
                {
                    id: 2,
                    name: 'Mc Donalds',
                    address: 'Honduras 4709, Villa Insuperable, Buenos Aires Province, B1751, Argentina',
                    latitude: '-34.675893',
                    longitude: '-58.508822',
                    category: 'GASTRONOMY',
                    score: 3.7,
                    reviewCount: 102,
                },
                {
                    id: 3,
                    name: 'Hilton',
                    address: 'Honduras 4709, Moreno, Buenos Aires Province, B1743, Argentina',
                    latitude: '-34.621728',
                    longitude: '-58.80039',
                    category: 'ACCOMMODATION',
                    score: 4.2,
                    reviewCount: 43,
                },
                {
                    id: 4,
                    name: 'Eretz 2',
                    address: 'Honduras 4709, Palermo, Buenos Aires, C1414, Argentina',
                    latitude: '-34.590716',
                    longitude: '-58.427125',
                    category: 'GASTRONOMY',
                    score: 4.8,
                    reviewCount: 25,
                },
                {
                    id: 5,
                    name: 'Mc Donalds 2',
                    address: 'Honduras 4709, Villa Insuperable, Buenos Aires Province, B1751, Argentina',
                    latitude: '-34.675893',
                    longitude: '-58.508822',
                    category: 'GASTRONOMY',
                    score: 3.7,
                    reviewCount: 102,
                },
                {
                    id: 6,
                    name: 'Hilton 2',
                    address: 'Honduras 4709, Moreno, Buenos Aires Province, B1743, Argentina',
                    latitude: '-34.621728',
                    longitude: '-58.80039',
                    category: 'ACCOMMODATION',
                    score: 4.2,
                    reviewCount: 43,
                },
            ],
        };
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

    async getPlaceReviews(placeId: number): Promise<ReviewsResponse> {
        switch (placeId) {
            case 1:
                return {
                    results: [
                        {
                            placeId: 1,
                            score: 4.8,
                            owner: 'Ana Cruz',
                            text: 'Excelente la comida!! Me dieron ganas de viajar a medio Oriente!.',
                            images: [],
                            state: '10/02/2023',
                        },
                        {
                            placeId: 1,
                            score: 2.8,
                            owner: 'HakimiGirl',
                            text: 'Rica comida israelí',
                            images: [],
                            state: '',
                        },
                        {
                            placeId: 1,
                            score: 4.8,
                            owner: 'Ana Cruz de nuevo',
                            text: 'essselente de nuevo como as always',
                            images: [],
                            state: '',
                        },
                    ],
                };

            case 2:
                return {
                    results: [],
                };

            case 3:
                return {
                    results: [
                        {
                            placeId: 3,
                            score: 3.5,
                            owner: 'Ana Cruz',
                            text: 'Muy piola',
                            images: [],
                            state: '15/03/2023',
                        },
                    ],
                };

            default:
                return {
                    results: [],
                };
        }
    }

}

const mockApiAdapter = new MockApiAdapter();

export { mockApiAdapter };
