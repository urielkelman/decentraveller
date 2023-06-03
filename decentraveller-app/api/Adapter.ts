import { PlacesResponse } from './response/places';

export default abstract class Adapter {
    abstract getRecommendedPlacesForAddress(
        walletAddress: string,
        latitude?: string,
        longitude?: string
    ): Promise<PlacesResponse>;
    abstract getRecommendedPlacesByLocation(latitude: string, longitude: string): Promise<PlacesResponse>;
}
