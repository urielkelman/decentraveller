import { UserResponse } from '../response/user';

const MatiUserResponse: UserResponse = {
    code: 404,
    results: null,
};

const UriUserResponse: UserResponse = {
    code: 200,
    results: [
        {
            owner: '0x1234',
            nickname: 'elUriK',
            country: 'Argelia',
            interest: 'Messi',
        },
    ],
};

const GianUserResponse: UserResponse = {
    code: 200,
    results: [
        {
            owner: '0x1234',
            nickname: 'giano',
            country: 'Israel',
            interest: 'Comunismo',
        },
    ],
};

export { MatiUserResponse, UriUserResponse, GianUserResponse };
