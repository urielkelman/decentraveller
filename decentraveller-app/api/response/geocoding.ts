export type GeocodingElementResponse = {
    fullAddress: string;
    latitude: string;
    longitude: string;
};

export type GeocodingResponse = {
    results: GeocodingElementResponse[];
};