import { Dimensions, StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR, DECENTRAVELLER_DEFAULT_CONTRAST_COLOR } from '../commons/global';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const placeDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        marginTop: -20,
    },
    imageContainer: {
        borderRadius: 45,
        transform: [{ translateY: -100 }],
        marginTop: 10,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        height: windowHeight * 0.4,
        width: windowWidth,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 13,
        shadowColor: '#000',
        elevation: 30,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: -90,
        paddingHorizontal: 20,
    },
    recommendationContainer: {
        marginTop: -15,
        marginBottom: 10,
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    placeTitleContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        maxWidth: windowWidth - 140,
    },
    bulletsContainer: {
        flexDirection: 'column',
        marginLeft: 'auto',
        minWidth: 100,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: -5,
    },
    titleText2: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: -15,
    },
    locationText: {
        fontSize: 15,
        fontWeight: '100',
        fontFamily: 'Montserrat_400Regular',
        width: 250,
        height: 50,
    },
    locationText2: {
        fontSize: 12,
        fontWeight: '100',
        fontFamily: 'Montserrat_400Regular',
        width: 250,
        height: 50,
    },
    location2TextContainer: {
        flexDirection: 'column',
    },
    location2TextMargin: {
        marginBottom: -35,
        marginRight: 20,
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
        marginTop: -20,
    },
    bulletSubText: {
        fontSize: 12,
        fontWeight: 'normal',
        marginLeft: -5,
        marginTop: 3,
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
});

const placeReviewsBoxStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 0,
        paddingHorizontal: 12,
    },
    reviewsHeader: {
        paddingVertical: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    moreText: {
        fontSize: 16,
        color: 'blue',
        fontWeight: 'bold',
        marginHorizontal: 'auto',
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#F0F0F0',
        marginBottom: 6,
        borderRadius: 10,
    },
    reviewItem: {
        backgroundColor: '#F0F0F0',
        marginTop: 6,
        marginBottom: 6,
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
    },
    reviewStatusRibbon: {
        backgroundColor: DECENTRAVELLER_DEFAULT_CONTRAST_COLOR,
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: 5,
        paddingVertical: 5
    },
    reviewStatusRibbonText: {
        color: '#F0F0F0',
        fontFamily: 'Montserrat_700Bold',
    },
    imagesContainer: {
        paddingHorizontal: 10,
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 80,
    },
    imageContainer: {
        marginRight: 10,
        flex: 1,
    },
    imageFlatList: {
        flex: 1,
        paddingVertical: 10,
        overflow: 'scroll',
    },
    image: {
        borderRadius: 10,
        height: 60,
        width: 80,
    },
    moreImages: {
        paddingRight: 10,
        height: 80,
        position: 'absolute',
        width: 40,
        alignSelf: 'flex-end',
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commentText: {
        paddingHorizontal: 10,
        fontSize: 15,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    dataContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    userContainer: {
        flexDirection: 'column',
        marginLeft: 'auto',
    },
    avatarImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginBottom: 2,
        marginLeft: 'auto',
    },
    userNameText: {
        fontSize: 12,
        color: 'rgb(80,80,80)',
        fontWeight: 'bold',
    },
    dateText: {
        opacity: 0.6,
        color: 'gray',
    },
    buttonContainer: {
        paddingVertical: 12,
        borderRadius: 10,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#983B46',
        alignItems: 'center',
        borderRadius: 10,
        padding: 4,
        height: 30,
    },
    buttonTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 8,
    },
    text: {
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
        fontWeight: 'bold',
    },
});

const placeSimilarsBoxStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        overflow: 'hidden',
        paddingHorizontal: 10,
        margin: 0,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
});

export { placeDetailStyles, placeReviewsBoxStyles, placeSimilarsBoxStyles };
