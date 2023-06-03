import {View, Image, Text, StyleSheet, Dimensions} from 'react-native';
import PlaceReviewsBox from "./PlaceReviewsBox";


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const path = '../../../assets/mock_images/eretz-inside.jpeg';

const PlaceDetailScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require(path)} style={styles.image} />
            </View>
            <View style={styles.shadowContainer} />
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>Eretz Cantina</Text>
                <View style={styles.bulletItem}>
                    <Image source={require('../../../assets/images/location.png')} style={styles.bulletLocationImage} />
                    <Text style={styles.locationText}>Honduras 4709, Palermo CABA</Text>
                </View>
            </View>
            <View style={styles.bulletsContainer}>
                <View style={styles.bulletItem}>
                    <Image source={require('../../../assets/images/estrellita.png')} style={styles.bulletImage} />
                    <View style={styles.bulletTextContainer}>
                        <Text style={styles.bulletText}>Raiting</Text>
                        <Text style={styles.bulletSubText}>4.8</Text>
                    </View>
                </View>
                <View style={[styles.bulletItem, { marginTop: -15 }]}>
                    <Image source={require('../../../assets/images/caminito.png')} style={styles.bulletImage} />
                    <View style={styles.bulletTextContainer}>
                        <Text style={styles.bulletText}>Distance</Text>
                        <Text style={styles.bulletSubText}>0.4 km</Text>
                    </View>
                </View>
            </View>

            <View style={styles.placeReviewsContainer}>
                <PlaceReviewsBox />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        marginTop: -20,
    },
    imageContainer: {
        borderRadius: 45,
        transform: [{ translateY: -60 }],
        marginTop: 10,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        height: windowHeight * 0.5,
        width: windowWidth,
        shadowOffset: { width: 1.5, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        shadowColor: '#000',
        elevation: 9,
    },
    textContainer: {
        position: 'absolute',
        top: windowHeight * 0.45,
        left: 20,
    },
    titleText: {
        fontSize: 35,
        fontWeight: 'bold',
        marginTop: 1
    },
    locationText: {
        fontSize: 18,
        fontWeight: '100',
        fontFamily: 'Montserrat_400Regular',
        width: 250

    },
    bulletsContainer: {
        position: 'absolute',
        top: windowHeight * 0.45,
        right: 30,
        alignItems: 'flex-start',
        marginTop: 10
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    bulletImage: {
        width: 50,
        height: 50,
        marginRight: 5,
    },
    bulletLocationImage: {
        width: 30,
        height: 30,
        marginRight: 5,
    },
    bulletText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: -10,
        marginTop: -20
    },
    bulletSubText: {
        fontSize: 12,
        fontWeight: 'normal',
        marginLeft: -5,
        marginTop: 3
    },
    bulletTextContainer: {
        flexDirection: 'column',
    },
    shadowContainer: {
        borderRadius: 50,
        marginTop: -390,
        marginLeft: 40,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        height: windowHeight * 0.5,
        width: windowWidth / 1.3,
        shadowOffset: { width: 1.5, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0.9,
        shadowColor: '#000',
        elevation: 15,
    },
    placeReviewsContainer: {
        marginTop: 100,
        marginHorizontal: 16,

    },
});

export default PlaceDetailScreen;