import { PlaceResponse } from '../../api/response/places';
import PlaceItem from '../../screens/home/place/PlaceItem';
import { FlatList } from 'react-native';
import React from 'react';

const renderPlaceItem = ({ item, minified }: { item: PlaceResponse; minified: boolean }) => (
    <PlaceItem
        id={item.id}
        name={item.name}
        address={item.address}
        category={item.category}
        latitude={item.latitude}
        longitude={item.longitude}
        score={item.score}
        reviewCount={item.reviews}
        imageBase64={null}
        minified={minified}
    />
);

export type PlacesItemsProps = {
    places: PlaceResponse[];
    minified: boolean;
    horizontal: boolean;
};

const DecentravellerPlacesList: React.FC<PlacesItemsProps> = ({ places, minified, horizontal }) => {
    const internalRenderPlaceItem = ({ item }: { item: PlaceResponse }) =>
        renderPlaceItem({ item: item, minified: minified });

    return <FlatList data={places} renderItem={internalRenderPlaceItem} horizontal={horizontal} />;
};

export { DecentravellerPlacesList };
