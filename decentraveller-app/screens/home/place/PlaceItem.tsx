import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { DecentravellerPlaceCategory } from '../../../context/types';
import React from 'react';
import {
    countryFlagSize,
    placeItemStyle,
    rateReviewIcon,
    placeItemMinifiedStyle,
} from '../../../styles/placeItemstyle';
// @ts-ignore
import { ISOCodeByCountry } from './countriesConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { PlaceDetailParams, PlaceDetailScreenProp } from './types';
import { useNavigation } from '@react-navigation/native';
import StarComponent from '../../../commons/components/StarComponent';

export type PlaceItemProps = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    score: number;
    category: DecentravellerPlaceCategory;
    reviewCount: number;
    imageBase64: string | null;
    minified: boolean;
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
    imageBase64,
    minified,
}) => {
    const navigation = useNavigation<PlaceDetailScreenProp>();
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

    const placeDetailParams: PlaceDetailParams = {
        id: id,
        name: name,
        address: address,
        score: score,
        reviewCount: reviewCount,
    };
    const itemStyle = minified ? placeItemMinifiedStyle : placeItemStyle;

    const imageToUse =
        imageBase64 != null
            ? {
                  uri: `data:image/jpeg;base64,${imageBase64}`,
              }
            : require('../../../assets/images/no_place_image.jpg');

    return (
        <TouchableOpacity onPress={() => navigation.navigate('PlaceDetailScreen', placeDetailParams)}>
            <View style={itemStyle.container}>
                <View style={itemStyle.leftContainer}>
                    <Image style={itemStyle.image} source={imageToUse} />
                </View>
                <View style={itemStyle.rightSideContainer}>
                    <View style={itemStyle.informationContainer}>
                        <Text style={itemStyle.nameText}>{name}</Text>
                        {countryISOCode ? (
                            <CountryFlag
                                isoCode={countryISOCode}
                                size={countryFlagSize}
                                style={itemStyle.countryFlag}
                            />
                        ) : (
                            <></>
                        )}
                    </View>
                    <View>
                        <Text style={itemStyle.subtitleText}>{capitalizedCategory}</Text>
                    </View>
                    <View style={itemStyle.informationContainer}>
                        <Text style={itemStyle.informationText}>Score:</Text>
                        <StarComponent score={score} />
                        {!minified ? (
                            <View style={itemStyle.informationContainer}>
                                <MaterialIcons
                                    name="rate-review"
                                    size={rateReviewIcon.size}
                                    color={rateReviewIcon.color}
                                    style={rateReviewIcon.style}
                                />
                                <Text style={itemStyle.informationText}>{reviewCount}</Text>
                            </View>
                        ) : null}
                    </View>
                    <View style={itemStyle.informationContainer}>
                        <Text style={itemStyle.informationText}>{addressToShow}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PlaceItem;
