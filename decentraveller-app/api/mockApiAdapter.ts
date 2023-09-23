import { GeocodingResponse } from './response/geocoding';
import { Honduras4709GeocodingResponse, HondurasGeocodingResponse } from './mocks/geocoding';
import { UserResponse } from './response/user';
import { GianUserResponse, MatiUserResponse, UriUserResponse } from './mocks/user';
import { alternativePlacesMock, defaultPlacesMock } from './mocks/places';
import { ReviewImageResponse, ReviewsResponse } from './response/reviews';
import { emptyReviewsResponse, imageReviewResponse, manyReviewsResponse, oneReviewsResponse } from './mocks/reviews';
import { PlaceResponse } from './response/places';
import { HttpGetRequest } from '../connectors/HttpConnector';
import { PLACES_SEARCH } from './config';

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
            default: {
                return UriUserResponse;
            }
        }
    }

    async getMyPlacesPlaces(walletAddress: string): Promise<PlaceResponse[]> {
        return [
            {
                id: 1,
                name: 'Eretz',
                address: 'Honduras 4709, Palermo, Buenos Aires, C1414, Argentina',
                latitude: '-34.590716',
                longitude: '-58.427125',
                category: 'GASTRONOMY',
                score: 4.8,
                reviews: 25,
            },
        ];
    }

    async getRecommendedPlacesForAddress(
        walletAddress: string,
        [latitude, longitude]: [string?, string?],
        onNotFound: () => void,
    ): Promise<PlaceResponse[]> {
        return defaultPlacesMock;
    }

    async getRecommendedPlaces(
        [latitude, longitude]: [string, string],
        interest?: string,
        sort_by?: string | null,
        at_least_stars?: number | null,
        maximum_distance?: number | null,
    ): Promise<PlaceResponse[]> {
        const queryParams: Record<string, string> = {
            latitude: latitude,
            longitude: longitude,
            page: '1',
            per_page: '5000',
        };

        if (sort_by !== null && sort_by !== undefined) {
            queryParams.sort_by = sort_by;
        }

        if (interest !== null && interest !== undefined) {
            queryParams.place_category = interest;
        }

        if (at_least_stars !== null && at_least_stars !== undefined) {
            queryParams.at_least_stars = at_least_stars.toString();
        }

        if (maximum_distance !== null && maximum_distance !== undefined) {
            queryParams.maximum_distance = maximum_distance.toString();
        }

        const httpRequest: HttpGetRequest = {
            url: PLACES_SEARCH,
            queryParams,
            onUnexpectedError: (e) => console.log('Error'),
        };

        console.log(httpRequest);

        if (latitude === '-34.584472' && longitude === '-58.435681') {
            return alternativePlacesMock;
        }
        return defaultPlacesMock;
    }

    async getPlaceReviews(placeId: number): Promise<ReviewsResponse> {
        switch (placeId) {
            case 1:
                return manyReviewsResponse;

            case 2:
                return oneReviewsResponse;

            default:
                return emptyReviewsResponse;
        }
    }

    async getUserProfileImage(walletAddress: string, onFailed: () => void): Promise<string> {
        return 'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAEYklEQVR4nOzd3cvY8x/H8d+136VZtCIHxBQHrGRuSmbtwA5wpBwoi6skuTvAgRzYCNGUAwcOaFkiU3NZUsaaaSRFKzM1K8pNkyOlmEm2A3/Fu9Tz8fgDXp/vybP34Xfx8M6t/5t0/NmLRvc/eumR0f1Dqx4b3X/zn7NG98/Ytn90f9Wh2e+/+8zl0f0Vo+vwHycA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQtvvHMn6MPXLZi9ej+K9d+O7p/9l1HR/cvP3DO6P6HWy4d3b/khR9H928597TRfReANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIG3hyIFjow98uvLq0f2DX1wzun/fhtn/J/z0y72j+zu2Lozu73/g99H9hy8+ObrvApAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkLVxw//bRB45tXjm6v/vg8uj+40+sG92/bdM7o/s3Hz0xuv/edfeM7j/63Tej+y4AaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQNrC95tvH31gx4M3jO4fvHXX6P7pD305ur/xyTtG9z/fc3x0f/Xaq0b3/9hw5ei+C0CaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQtnDFmmOjD3y849XR/Z3LF47ur129Z3R/5dP7Rvf/Prl9dH/LvhtH90++vm503wUgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASFtcWl4/+sCRt/eO7l///J2j+0sfnD+6v/GvH0b3Xzt6YnT/qaXZ/yect+bn0X0XgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBt8aavl0YfeHfb+6P7v546PLq/661PRvdfPLVpdP+59S+P7u/+6rfR/c/2/n903wUgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASPs3AAD//0zzZUNB7GJ+AAAAAElFTkSuQmCC';
    }

    async sendReviewImage(
        walletAddress: string,
        imageUris: string[],
        onFailed: () => void,
    ): Promise<ReviewImageResponse> {
        return imageReviewResponse;
    }

    async getRules(): Promise<RulesResponse> {
        const rules: Rule[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);
            const status = statusIndex === 0 ? 'APPROVED' : 'DELETED';

            rules.push({
                id: i,
                description: `Rule ${i}: This is an invented rule.`,
                status,
            });
        }

        return { rules };
    }


    async getRulesInVotation(
    ): Promise<RulesResponse> {
        const rules: Rule[] = [];

        for (let i = 10; i <= 20; i++) {
            const statusIndex = Math.floor(Math.random() * 2);
            const status = statusIndex === 0 ? 'PENDING_APPROVAL' : 'PENDING_DELETED';

            rules.push({
                id: i,
                description: `Rule ${i}: This is an invented rule in votation.`,
                status,
            });
        }

        return { rules };
    }
}

const mockApiAdapter = new MockApiAdapter();

export { mockApiAdapter };
