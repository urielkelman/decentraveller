import { PlacesResponse } from './response/places';

export default abstract class Adapter {
    abstract getRecommendedPlacesForAddress(
        walletAddress: string,
        [latitude, longitude]: [string?, string?]
    ): Promise<PlacesResponse>;
    abstract getRecommendedPlaces([latitude, longitude]: [string, string]): Promise<PlacesResponse>;
}
