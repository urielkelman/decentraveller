export type ReviewResponse = {
    placeId: number
    score: number
    owner: string
    text: string
    images: string[]
    state: string
};

export type ReviewsResponse = {
    results: ReviewResponse[];
};
