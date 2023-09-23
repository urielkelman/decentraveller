import { DecentravellerPlaceCategory } from '../../context/types';
import { ReviewResponse } from './reviews';

export type PlaceResponse = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    category: DecentravellerPlaceCategory;
    score: number;
    reviews: number;
};

export type PlacesResponse = {
    places: PlaceResponse[];
    total: number;
    page: number;
    perPage: number;
};
