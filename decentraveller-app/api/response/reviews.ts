import { UserResponse } from './user';
import { BackendReviewStatus } from '../../blockchain/types';

export type ReviewImageResponse = {
    hashes: string[];
};

export type ReviewResponse = {
    id: number;
    placeId: number;
    score: number;
    text: string;
    imageCount: number;
    status: BackendReviewStatus;
    owner: UserResponse;
    createdAt: string;
};

export type ReviewsResponse = {
    reviews: ReviewResponse[];
    total: number;
    page: number;
    perPage: number;
};
