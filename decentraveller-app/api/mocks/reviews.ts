import {ReviewsResponse} from "../response/reviews";

export const manyReviewsResponse: ReviewsResponse = {
    results: [
        {
            placeId: 1,
            score: 4.8,
            owner: 'Ana Cruz',
            text: 'Excelente la comida!! Me dieron ganas de viajar a medio Oriente!.',
            images: [],
            state: '10/02/2023',
        },
        {
            placeId: 1,
            score: 2.8,
            owner: 'HakimiGirl',
            text: 'Rica comida israelí',
            images: [],
            state: '',
        },
        {
            placeId: 1,
            score: 4.8,
            owner: 'Ana Cruz de nuevo',
            text: 'essselente de nuevo como as always',
            images: [],
            state: '',
        },
    ],
};


export const oneReviewsResponse: ReviewsResponse = {
    results: [
        {
            placeId: 2,
            score: 4.8,
            owner: 'Ana Cruz',
            text: 'Muy piola',
            images: [],
            state: '10/02/2023',
        }
    ],
};

export const emptyReviewsResponse: ReviewsResponse = {
    results: [],
};