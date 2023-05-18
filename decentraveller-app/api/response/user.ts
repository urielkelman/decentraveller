import { HttpStatusCode } from 'axios';

export type UserElementResponse = {
    owner: string;
    nickname: string;
    country: string;
    interest: string;
};

export type UserResponse = {
    results: UserElementResponse;
};
