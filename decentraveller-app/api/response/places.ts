export type PlaceResponse = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    category: 'GASTRONOMY' | 'ENTERTAINMENT' | 'ACCOMMODATION' | 'OTHER';
};

export type PlacesResponse = {
    results: PlaceResponse[];
};
