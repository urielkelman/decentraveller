import { PlaceResponse } from '../../api/response/places';
import PlaceItem from '../../screens/home/place/PlaceItem';
import { FlatList  } from 'react-native';
import React from 'react';

const renderPlaceItem = ({ item }: { item: PlaceResponse }) => (
    <PlaceItem
        id={item.id}
        name={item.name}
        address={item.address}
        category={item.category}
        latitude={item.latitude}
        longitude={item.longitude}
        score={item.score}
        reviewCount={item.reviews}
    />
);

export type PlacesItemsProps = {
    places: PlaceResponse[];
};

const DecentravellerPlacesItems: React.FC<PlacesItemsProps> = ({ places }) => (
    <FlatList data={places} renderItem={renderPlaceItem} />
);

export default DecentravellerPlacesItems;
