import {View, Image, Text, StyleSheet, Dimensions} from 'react-native';
import PlaceReviewsBox from "./PlaceReviewsBox";
import {placeDetailStyles} from "../../../styles/placeDetailStyles";
import {PlaceDetailData} from "./types";


const path = '../../../assets/mock_images/eretz-inside.jpeg';
const locationIconPath = '../../../assets/images/location.png'
const rankingIconPath = '../../../assets/images/estrellita.png'
const distanceIconPath = '../../../assets/images/caminito.png'

interface PlaceDetailScreenProps {
    route: PlaceDetailData;
}

const PlaceDetailScreen: React.FC<PlaceDetailScreenProps> = ({ route }) => {
    const { placeItemData } = route.params;
    const { name, address, score, reviewCount } = placeItemData;
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
                <View style={placeDetailStyles.bulletItem}>
                    <Image source={require(rankingIconPath)} style={placeDetailStyles.bulletImage} />
                    <View style={placeDetailStyles.bulletTextContainer}>
                        <Text style={placeDetailStyles.bulletText}>Raiting</Text>
                        <Text style={placeDetailStyles.bulletSubText}>{score}</Text>
                    </View>
                </View>
                <View style={[placeDetailStyles.bulletItem, { marginTop: -15 }]}>
                    <Image source={require(distanceIconPath)} style={placeDetailStyles.bulletImage} />
                    <View style={placeDetailStyles.bulletTextContainer}>
                        <Text style={placeDetailStyles.bulletText}>Distance</Text>
                        <Text style={placeDetailStyles.bulletSubText}>0.4 km</Text>
                    </View>
                </View>
            </View>

            <View style={placeDetailStyles.placeReviewsContainer}>
                <PlaceReviewsBox />
            </View>
        </View>
    );
};

export default PlaceDetailScreen;