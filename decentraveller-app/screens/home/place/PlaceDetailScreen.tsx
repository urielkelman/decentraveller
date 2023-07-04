import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import PlaceReviewsBox from './PlaceReviewsBox';
import { placeDetailStyles } from '../../../styles/placeDetailStyles';
import {PlaceDetailData, PlaceDetailScreenProps} from './types';
import React, { useEffect } from 'react';
import {RouteProp} from "@react-navigation/native";

const path = '../../../assets/mock_images/eretz-inside.jpeg';
const locationIconPath = '../../../assets/images/location.png';
const rankingIconPath = require('../../../assets/images/estrellita.png');
const distanceIconPath = require('../../../assets/images/caminito.png');

type BulletItemProps = {
    iconPath: any;
    title: string;
    value: string;
    marginTop: number;
};

const bulletItemComponent: React.FC<BulletItemProps> = ({ iconPath, title, value, marginTop }) => {
    return (
        <View style={[placeDetailStyles.bulletItem, { marginTop: marginTop }]}>
            <Image source={iconPath} style={placeDetailStyles.bulletImage} />
            <View style={placeDetailStyles.bulletTextContainer}>
                <Text style={placeDetailStyles.bulletText}>{title}</Text>
                <Text style={placeDetailStyles.bulletSubText}>{value}</Text>
            </View>
        </View>
    );
};

const PlaceDetailScreen: React.FC<PlaceDetailScreenProps> = ({ route }) => {
    const { placeItemData } = route.params;
    const { id, name, address, score, reviewCount } = placeItemData;

    return (
        <View style={placeDetailStyles.container}>
            <View style={placeDetailStyles.imageContainer}>
                <Image source={require(path)} style={placeDetailStyles.image} />
            </View>
            <View style={placeDetailStyles.shadowContainer} />
            <View style={placeDetailStyles.textContainer}>
                <Text style={placeDetailStyles.titleText}>{name}</Text>
                <View style={placeDetailStyles.bulletItem}>
                    <Image source={require(locationIconPath)} style={placeDetailStyles.bulletLocationImage} />
                    <Text style={placeDetailStyles.locationText}>{address}</Text>
                </View>
            </View>
            <View style={placeDetailStyles.bulletsContainer}>
                {bulletItemComponent({
                    iconPath: rankingIconPath,
                    title: 'Rating',
                    value: score.toString(),
                    marginTop: 0,
                })}
                {bulletItemComponent({
                    iconPath: distanceIconPath,
                    title: 'Distance',
                    value: '0.4 km',
                    marginTop: -15,
                })}
            </View>
            <View style={placeDetailStyles.placeReviewsContainer}>
                <PlaceReviewsBox placeId={id} />
            </View>
        </View>
    );
};

export default PlaceDetailScreen;
