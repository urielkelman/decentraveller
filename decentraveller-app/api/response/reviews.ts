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
    censor_moderator: string;
    broken_rule_id: number;
};

export type ReviewsResponse = {
    reviews: ReviewResponse[];
    total: number;
    page: number;
    perPage: number;
};
