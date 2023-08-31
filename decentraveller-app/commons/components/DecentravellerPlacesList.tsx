import { PlaceResponse } from '../../api/response/places';
import PlaceItem from '../../screens/home/place/PlaceItem';
import { FlatList } from 'react-native';
import React from 'react';
import { DecentravellerPlaceCategory } from '../../context/types';

export type PlaceShowProps = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    score: number;
    category: DecentravellerPlaceCategory;
    reviewCount: number;
    imageBase64: string | null;
};

const renderPlaceItem = ({ item, minified }: { item: PlaceShowProps; minified: boolean }) => (
    <PlaceItem
        id={item.id}
        name={item.name}
        address={item.address}
        category={item.category}
        latitude={item.latitude}
        longitude={item.longitude}
        score={item.score}
        reviewCount={item.reviewCount}
        imageBase64={item.imageBase64}
        minified={minified}
    />
);

export type PlacesItemsProps = {
    places: PlaceShowProps[];
    minified: boolean;
    horizontal: boolean;
};

const DecentravellerPlacesList: React.FC<PlacesItemsProps> = ({ places, minified, horizontal }) => {
    const internalRenderPlaceItem = ({ item }: { item: PlaceShowProps }) =>
        renderPlaceItem({ item: item, minified: minified });

    return <FlatList data={places} renderItem={internalRenderPlaceItem} horizontal={horizontal} />;
};

export { DecentravellerPlacesList };
