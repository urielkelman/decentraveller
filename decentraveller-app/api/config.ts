import Constants from 'expo-constants';

console.log(Constants.deviceName);

export let API_ENDPOINT;
export let JSON_RPC_URL;

if (Constants.deviceName === 'Simulator' || Constants.deviceName.includes('Emulator')) {
    API_ENDPOINT = 'http://10.0.2.2:8000';
    JSON_RPC_URL = 'http://10.0.2.2:8545';
} else {
    API_ENDPOINT = 'http://192.168.1.3:8000';
    JSON_RPC_URL = 'https://dtblockchain.loca.lt/';
}

export const FORWARD_GEOCODING_ENDPOINT = '/geocoding/forward';
export const GET_USER_ENDPOINT = '/profile';
export const PUSH_NOTIFICATION_TOKEN_ENDPOINT = '/profile/push-token';
export const RECOMMENDED_PLACES_BY_LOCATION_ENDPOINT = '/recommendations';
export const RECOMMENDED_PLACES_BY_PROFILE_ENDPOINT = '/profile/{owner}/recommendations';
export const OWNED_PLACES_ENDPOINT = '/place/owned';
export const REVIEWS_PLACES_ENDPOINT = '/place/{placeId}/reviews';
export const GET_PROFILE_IMAGE = '/profile/{owner}/avatar.jpg';
