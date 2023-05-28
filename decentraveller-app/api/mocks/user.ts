import { UserElementResponse, UserResponse } from '../response/user';

const MatiUserResponse: UserResponse = {
    UserElementResponse: null,
};

const UriUserResponse: UserResponse = {
    UserElementResponse: {
        owner: '0x1234',
        nickname: 'ElUriK',
        country: 'Argentina',
        interest: 'Entertainment',
        createdAt: '10/05/2025',
    },
};

const GianUserResponse: UserResponse = {
    UserElementResponse: {
        owner: '0x1234',
        nickname: 'giano',
        country: 'Israel',
        interest: 'Comunismo',
        createdAt: '02/04/2023',
    },
};

export { MatiUserResponse, UriUserResponse, GianUserResponse };
