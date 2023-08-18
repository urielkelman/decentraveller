import { Dimensions, StyleSheet } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const placeDetailStyles = StyleSheet.create({
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
    bulletsContainer: {
        position: 'absolute',
        top: windowHeight * 0.45,
        right: 30,
        alignItems: 'flex-start',
        marginTop: 10,
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
    placeReviewsContainer: {
        marginTop: 100,
        marginHorizontal: 16,
    },
});

const placeReviewsBoxStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 10,
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
        fontSize: 12,
        color: 'blue',
        fontWeight: 'bold',
    },
    reviewItem: {
        marginBottom: 6,
    },
    commentContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 53,
    },
    commentText: {
        fontSize: 15,
        flex: 1,
        marginRight: 6,
    },
    userContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    avatarImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginBottom: 2,
        marginRight: 10,
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

export { placeDetailStyles, placeReviewsBoxStyles };
