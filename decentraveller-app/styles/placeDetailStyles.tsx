import { Dimensions, StyleSheet } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const placeDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',
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
    bulletsContainer: {
        flexDirection: 'column',
        marginLeft: 'auto',
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 1,
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
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 0,
        paddingHorizontal: 12,
    },
    reviewsHeader: {
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
    },
    reviewsFooter: {},
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
    },
    userNameText: {
        fontSize: 12,
        color: 'red',
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
