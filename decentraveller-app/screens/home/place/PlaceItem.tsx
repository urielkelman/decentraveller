import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { DecentravellerPlaceCategory } from '../../../context/types';
import React from 'react';
import { countryFlagSize, placeItemStyle, rateReviewIcon, starComponentStyle } from '../../../styles/placeItemstyle';
// @ts-ignore
import eretzMockImage from '../../../assets/mock_images/eretz-restaurant-in-buenos.jpg';
import { ISOCodeByCountry } from './countriesConfig';
import { Rating } from 'react-native-rating-element';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export type PlaceItemProps = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    score: number;
    category: DecentravellerPlaceCategory;
    reviewCount: number;
};

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

const PlaceItem: React.FC<PlaceItemProps> = ({
    id,
    name,
    address,
    latitude,
    longitude,
    score,
    category,
    reviewCount,
}) => {
    const navigation = useNavigation();
    let countryISOCode: string | undefined;
    try {
        const country = address.split(',').slice(-1)[0].substring(1);
        countryISOCode = ISOCodeByCountry[country];
    } catch (_) {}

    const addressToShow = address.split(',').slice(0, 3).join(',');

    const capitalizeCategory = (category: DecentravellerPlaceCategory): string => {
        const lowercaseStr = category.toLowerCase();
        return lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1);
    };

    const capitalizedCategory = capitalizeCategory(category);

    console.log(name);
    return (
        <TouchableOpacity onPress={() => navigation.navigate('PlaceDetailScreen')}>
            <View style={placeItemStyle.container}>
                <View style={placeItemStyle.leftContainer}>
                    <Image style={placeItemStyle.image} source={eretzMockImage} />
                </View>
                <View style={placeItemStyle.rightSideContainer}>
                    <View style={placeItemStyle.informationContainer}>
                        <Text style={placeItemStyle.nameText}>{name}</Text>
                        {countryISOCode ? (
                            <CountryFlag
                                isoCode={countryISOCode}
                                size={countryFlagSize}
                                style={placeItemStyle.countryFlag}
                            />
                        ) : (
                            <></>
                        )}
                    </View>
                    <View>
                        <Text style={placeItemStyle.subtitleText}>{capitalizedCategory}</Text>
                    </View>
                    <View style={placeItemStyle.informationContainer}>
                        <Text style={placeItemStyle.informationText}>Score:</Text>
                        <StarComponent score={score} />
                        <MaterialIcons
                            name="rate-review"
                            size={rateReviewIcon.size}
                            color={rateReviewIcon.color}
                            style={rateReviewIcon.style}
                        />
                        <Text style={placeItemStyle.informationText}>{reviewCount}</Text>
                    </View>
                    <View style={placeItemStyle.informationContainer}>
                        <Text style={placeItemStyle.informationText}>{addressToShow}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PlaceItem;