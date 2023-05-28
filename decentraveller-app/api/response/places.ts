import { DecentravellerPlaceCategory } from '../../context/types';

export type PlaceResponse = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    category: DecentravellerPlaceCategory;
    score: number;
    reviewCount: number;
};

export type PlacesResponse = {
    results: PlaceResponse[];
};