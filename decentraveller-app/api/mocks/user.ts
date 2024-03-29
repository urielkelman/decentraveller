import { UserResponse } from '../response/user';

const MatiUserResponse: UserResponse = null;

const UriUserResponse: UserResponse = {
    owner: '0x1234',
    nickname: 'ElUriK',
    country: 'Argentina',
    interest: 'Entertainment',
    createdAt: '10/05/2025',
    role: 'MODERATOR',
};

const GianUserResponse: UserResponse = {
    owner: '0x1234',
    nickname: 'giano',
    country: 'Israel',
    interest: 'Comunismo',
    createdAt: '02/04/2023',
    role: 'NORMAL',
};

export { MatiUserResponse, UriUserResponse, GianUserResponse };
