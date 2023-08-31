import { PlaceResponse } from './response/places';

export default abstract class Adapter {
    abstract getRecommendedPlacesForAddress(
        walletAddress: string,
        [latitude, longitude]: [string?, string?],
        onNotFound: () => void
    ): Promise<PlaceResponse[]>;
    abstract getRecommendedPlaces([latitude, longitude]: [string, string]): Promise<PlaceResponse[]>;
    abstract getPlace(placeId: number, onFailed: () => void): Promise<PlaceResponse>;
}
