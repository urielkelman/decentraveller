import Constants from 'expo-constants';

console.log(Constants.deviceName);

export let API_ENDPOINT;
export let JSON_RPC_URL;

if (Constants.deviceName === 'Simulator' || Constants.deviceName.includes('Emulator')) {
    API_ENDPOINT = 'http://10.0.2.2:8000';
    JSON_RPC_URL = 'http://10.0.2.2:8545';
} else {
    //API_ENDPOINT = 'http://192.168.0.21:8000';
    API_ENDPOINT = 'http://192.168.1.115:8000';
    JSON_RPC_URL = 'https://dtblockchain.loca.lt';
}

export const FORWARD_GEOCODING_ENDPOINT = '/geocoding/forward';
export const GET_USER_ENDPOINT = '/profile';
export const GET_PLACE_ENDPOINT = '/place';
export const GET_REVIEW_ENDPOINT = '/review';
export const PUSH_NOTIFICATION_TOKEN_ENDPOINT = '/profile/push-token';
export const PLACES_SEARCH = '/places/search';
export const RECOMMENDED_PLACES_BY_PROFILE_ENDPOINT = '/profile/{owner}/recommendations';
export const RECOMMENDED_SIMILAR_PLACES = '/place/{placeId}/similars';
export const OWNED_PLACES_ENDPOINT = '/profile/{walletId}/places';
export const REVIEWS_PLACES_ENDPOINT = '/place/{placeId}/reviews';
export const REVIEWS_PROFILE_ENDPOINT = '/profile/{walletId}/reviews';
export const PROFILE_IMAGE = '/profile/{owner}/avatar.jpg';
export const PLACE_IMAGE = '/place/{placeId}/image.jpg';
export const PLACE_THUMBNAIL = '/place/{placeId}/thumbnail.jpg';
export const REVIEW_IMAGE = '/review/{imageNumber}.jpg?place_id={placeId}&id={reviewId}';
export const UPLOAD_IMAGES = '/uploads';

export const RULES_ENDPOINT = '/rule';
export const RULE_ENDPOINT = '/rule/{ruleId}';
