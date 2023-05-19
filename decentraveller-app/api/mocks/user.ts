import {UserElementResponse, UserResponse} from '../response/user';

const MatiUserResponse: UserResponse = {
    UserElementResponse: null,
};

const UriUserResponse: UserResponse = {
    UserElementResponse: {
        owner: "0x1234",
        nickname: "ElUriK",
        country: "Argentina",
        interest: "Messi",
    },
};

const GianUserResponse: UserResponse = {
    UserElementResponse: {
        owner: '0x1234',
        nickname: 'giano',
        country: 'Israel',
        interest: 'Comunismo',
    }
};

export { MatiUserResponse, UriUserResponse, GianUserResponse };
