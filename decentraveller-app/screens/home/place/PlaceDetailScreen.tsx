import { Image, Text, TouchableOpacity, View } from 'react-native';
import PlaceReviewsBox from './PlaceReviewsBox';
import { placeDetailStyles } from '../../../styles/placeDetailStyles';
import { PlaceDetailScreenProps } from './types';
import React, { useState } from 'react';
import PlaceSimilarsBox from './PlaceSimilarsBox';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import { useAppContext } from '../../../context/AppContext';

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
    const { userLocation } = useAppContext();
    const { id, name, address, latitude, longitude, score, category, reviewCount, imageUri } = route.params;
    const [isOpen, setIsOpen] = useState(false);

    const openGallery = () => setIsOpen(true);

    const closeGallery = () => setIsOpen(false);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const earthRadius = 6371; // Radius of the Earth in kilometers

        // Convert latitude and longitude from degrees to radians
        const lat1Rad = (lat1 * Math.PI) / 180;
        const lon1Rad = (lon1 * Math.PI) / 180;
        const lat2Rad = (lat2 * Math.PI) / 180;
        const lon2Rad = (lon2 * Math.PI) / 180;

        // Haversine formula
        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;

        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    };


    var locationComponent = null
    if(userLocation.value){
        const placeLatitude: number = +latitude;
        const placeLongitude: number = +longitude;
        const userLatitude: number = +userLocation.value[0];
        const userLongitude: number = +userLocation.value[1];
        const distanceToPlace = calculateDistance(userLatitude, userLongitude, placeLatitude, placeLongitude);
        locationComponent = bulletItemComponent({
            iconPath: distanceIconPath,
            title: 'Distance',
            value: Number(distanceToPlace).toFixed(2) + ' km',
            marginTop: -15,
        })
    }


    return (
        <View style={placeDetailStyles.container}>
            <TouchableOpacity style={placeDetailStyles.imageContainer} onPress={openGallery}>
                <Image style={placeDetailStyles.image} source={{ uri: imageUri }} />
            </TouchableOpacity>
            <View style={placeDetailStyles.headerContainer}>
                <View style={placeDetailStyles.placeTitleContainer}>
                    <Text style={placeDetailStyles.titleText} numberOfLines={2} adjustsFontSizeToFit>
                        {name}
                    </Text>
                    <View style={placeDetailStyles.bulletItem}>
                        <Image source={require(locationIconPath)} style={placeDetailStyles.bulletLocationImage} />
                        <Text style={placeDetailStyles.locationText} numberOfLines={2} adjustsFontSizeToFit>{address}</Text>
                    </View>
                </View>
                <View style={placeDetailStyles.bulletsContainer}>
                    {bulletItemComponent({
                        iconPath: rankingIconPath,
                        title: 'Rating',
                        value: formatScore(score),
                        marginTop: 0,
                    })}
                    {locationComponent}
                </View>
            </View>
            <View style={placeDetailStyles.recommendationContainer}>
                <PlaceSimilarsBox placeId={id} />
            </View>
            <PlaceReviewsBox placeId={id} summarized={true} />
            <ImageGallery close={closeGallery} isOpen={isOpen} images={[{ id: 1, url: imageUri }]} hideThumbs={true} />
        </View>
    );
};

export default PlaceDetailScreen;
