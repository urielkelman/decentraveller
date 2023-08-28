import { Rating } from 'react-native-rating-element';
import { starComponentStyle } from '../../styles/placeItemstyle';
import React from 'react';
import PlaceItem from '../../screens/home/place/PlaceItem';

const StarComponent = ({ score: number }) => {
    return (
        <Rating
            rated={number}
            totalCount={5}
            ratingColor={starComponentStyle.ratingColor}
            ratingBackgroundColor={starComponentStyle.ratingBackgroundColor}
            size={starComponentStyle.size}
            readonly
            icon="star"
            direction="row"
        />
    );
};

export default StarComponent;
