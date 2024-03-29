import { Image, Text, TouchableOpacity, View } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { DecentravellerPlaceCategory } from '../../../context/types';
import React from 'react';
import {
    countryFlagSize,
    placeItemMinifiedStyle,
    placeItemStyle,
    rateReviewIcon,
} from '../../../styles/placeItemstyle';
// @ts-ignore
import { ISOCodeByCountry } from './countriesConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { PlaceDetailParams, PlaceDetailScreenProp } from './types';
import { useNavigation } from '@react-navigation/native';
import StarComponent from '../../../commons/components/StarComponent';
import { PlaceShowProps } from '../../../commons/components/DecentravellerPlacesList';
import { apiAdapter } from '../../../api/apiAdapter';

const adapter = apiAdapter;

export type PlaceItemProps = PlaceShowProps & {
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
    minified,
}) => {
    const navigation = useNavigation<PlaceDetailScreenProp>();
    let countryISOCode: string | undefined;
    try {
        const country = address.split(',').slice(-1)[0].substring(1);
        countryISOCode = ISOCodeByCountry[country];
    } catch (_) {}

    const addressToShow = address.split(',').slice(0, 3).join(',');

    const imageToShow = !minified ? apiAdapter.getPlaceImageUrl(id) : apiAdapter.getPlaceThumbailUrl(id);

    const capitalizeCategory = (category: DecentravellerPlaceCategory): string => {
        const lowercaseStr = category.toLowerCase();
        return lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1);
    };

    const capitalizedCategory = capitalizeCategory(category);

    const placeDetailParams: PlaceDetailParams = {
        id: id,
        name: name,
        address: address,
        latitude: latitude,
        longitude: longitude,
        category: category,
        score: score,
        reviewCount: reviewCount,
    };
    const itemStyle = minified ? placeItemMinifiedStyle : placeItemStyle;

    const placeTitle = minified ? (
        <Text style={itemStyle.nameText} numberOfLines={1} adjustsFontSizeToFit>
            {name}
        </Text>
    ) : (
        <Text style={itemStyle.nameText} numberOfLines={2} adjustsFontSizeToFit>
            {name}
        </Text>
    );

    return (
        <TouchableOpacity onPress={() => navigation.navigate('PlaceDetailScreen', placeDetailParams)}>
            <View style={itemStyle.container}>
                <View style={itemStyle.leftContainer}>
                    <Image style={itemStyle.image} source={{ uri: adapter.getPlaceThumbailUrl(id) }} />
                </View>
                <View style={itemStyle.rightSideContainer}>
                    <View style={itemStyle.informationContainer}>{placeTitle}</View>
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
                        {countryISOCode ? (
                            <CountryFlag
                                isoCode={countryISOCode}
                                size={countryFlagSize}
                                style={itemStyle.countryFlag}
                            />
                        ) : (
                            <></>
                        )}
                        <Text
                            style={itemStyle.addressText}
                            numberOfLines={minified ? 1 : 2}
                            adjustsFontSizeToFit={!minified}
                        >
                            {addressToShow}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PlaceItem;
