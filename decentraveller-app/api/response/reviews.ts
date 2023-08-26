import {UserResponse} from './user';

export type ReviewImageResponse = {
    hashes: string[];
};

export type ReviewResponse = {
    id: number;
    placeId: number;
    score: number;
    text: string;
    imageCount: number;
    state: string;
    owner: UserResponse;
    createdAt: string;
};

export type ReviewsResponse = {
    reviews: ReviewResponse[];
    total: number;
    page: number;
    perPage: number;
};
