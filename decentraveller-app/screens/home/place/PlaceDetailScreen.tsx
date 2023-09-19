import { View, Image, Text, ScrollView } from 'react-native';
import PlaceReviewsBox from './PlaceReviewsBox';
import { placeDetailStyles } from '../../../styles/placeDetailStyles';
import { PlaceDetailScreenProps } from './types';
import React from 'react';
import PlaceSimilarsBox from './PlaceSimilarsBox';
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

function formatScore(number) {
    const formattedNumber = Number(number).toFixed(2);
    return formattedNumber.toString();
}

function needsMultipleLines(str: string, lines: number): boolean {
    const words = str.trim().split(/\s+/);
    return str.length > lines && words.length > 1;
}

function renderNameText(name: string): JSX.Element {
    const shouldShowInTwoLines = needsMultipleLines(name, 14);

    if (shouldShowInTwoLines) {
        const words = name.trim().split(/\s+/);
        const halfIndex = Math.ceil(words.length / 2);
        const name_1 = words.slice(0, halfIndex).join(' ');
        const name_2 = words.slice(halfIndex).join(' ');

        return (
            <>
                <Text style={placeDetailStyles.titleText}>{name_1}</Text>
                <Text style={placeDetailStyles.titleText2}>{name_2}</Text>
            </>
        );
    } else {
        return <Text style={placeDetailStyles.titleText}>{name}</Text>;
    }
}

function renderLocationText(location: string): JSX.Element {
    const shouldShowInTwoLines = needsMultipleLines(location, 20);

    if (shouldShowInTwoLines) {
        const words = location.trim().split(/\s+/);
        const halfIndex = Math.ceil(words.length / 3);
        const location_1 = words.slice(0, halfIndex).join(' ');
        const location_2 = words.slice(halfIndex, 2 * halfIndex).join(' ');
        const location_3 = words.slice(2 * halfIndex).join(' ');

        return (
            <View style={placeDetailStyles.bulletItem}>
                <Image source={require(locationIconPath)} style={placeDetailStyles.bulletLocationImage} />
                <View style={placeDetailStyles.location2TextContainer}>
                    <Text style={[placeDetailStyles.locationText2, placeDetailStyles.location2TextMargin]}>
                        {location_1}
                    </Text>
                    <Text style={[placeDetailStyles.locationText2, placeDetailStyles.location2TextMargin]}>
                        {location_2}
                    </Text>
                    <Text style={[placeDetailStyles.locationText2, placeDetailStyles.location2TextMargin]}>
                        {location_3}
                    </Text>
                </View>
            </View>
        );
    } else {
        return (
            <View style={placeDetailStyles.bulletItem}>
                <Image source={require(locationIconPath)} style={placeDetailStyles.bulletLocationImage} />
                <Text style={placeDetailStyles.locationText}>{location}</Text>
            </View>
        );
    }
}

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
    const { id, name, address, latitude, longitude, score, category, reviewCount, imageUri } = route.params;

    return (
        <View style={placeDetailStyles.container}>
            <View style={placeDetailStyles.imageContainer}>
                <Image
                    style={placeDetailStyles.image}
                    defaultSource={require('../../../assets/images/no_place_image.jpg')}
                    source={{ uri: imageUri }}
                />
            </View>
            <View style={placeDetailStyles.headerContainer}>
                <View style={placeDetailStyles.textContainer}>
                    {renderNameText(name)}
                    {renderLocationText(address)}
                </View>
                <View style={placeDetailStyles.bulletsContainer}>
                    {bulletItemComponent({
                        iconPath: rankingIconPath,
                        title: 'Rating',
                        value: formatScore(score),
                        marginTop: 0,
                    })}
                    {bulletItemComponent({
                        iconPath: distanceIconPath,
                        title: 'Distance',
                        value: '0.4 km',
                        marginTop: -15,
                    })}
                </View>
            </View>
            <View style={placeDetailStyles.recommendationContainer}>
                <PlaceSimilarsBox placeId={id} />
            </View>
            <PlaceReviewsBox placeId={id} summarized={true} />
        </View>
    );
};

export default PlaceDetailScreen;
