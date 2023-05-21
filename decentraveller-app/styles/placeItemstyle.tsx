import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');

const placeItemStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: width * 0.02,
        backgroundColor: 'white',
        padding: height * 0.02,
        margin: height * 0.02,
    },
    leftContainer: {
        flex: 0.3,
        justifyContent: 'center',
    },
    image: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
    },
    rightSideContainer: {
        flex: 0.7,
    },
    informationContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    nameText: {
        color: 'black',
        fontFamily: 'Montserrat_700Bold',
        fontSize: height * 0.025,
    },
    countryFlag: {
        size: width * 0.04,
        marginLeft: width * 0.04,
        marginTop: height * 0.005,
    },
    subtitleText: {
        color: 'black',
        fontFamily: 'Montserrat_500Medium',
        fontSize: height * 0.02,
        marginBottom: height * 0.01,
    },
    informationText: {
        color: 'black',
        fontFamily: 'Montserrat_500Medium',
        fontSize: height * 0.018,
        paddingRight: width * 0.01,
    },
});

const starComponentStyle = {
    ratingColor: '#983B46',
    ratingBackgroundColor: '#D4D4D4',
    size: placeItemStyle.informationText.fontSize * 1.2,
};

const rateReviewIcon = {
    size: placeItemStyle.informationText.fontSize * 1.5,
    color: '#983B46',
    style: {
        paddingLeft: width * 0.1,
        paddingRight: width * 0.02,
    },
};

export { placeItemStyle, starComponentStyle, rateReviewIcon };
