import { Dimensions, StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR, DECENTRAVELLER_DEFAULT_CONTRAST_COLOR } from '../commons/global';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const reviewDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    },
    title: {
        fontFamily: 'Montserrat_400Regular',
        fontWeight: 'bold',
        fontSize: 20,
        paddingVertical: 10,
    },
    placeDataContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingHorizontal: 5,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: '#000',
        elevation: 30,
        zIndex: 10,
    },
    reviewContainer: {
        paddingHorizontal: 5,
        paddingTop: 10,
    },
    optionButtonContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    buttonVoteContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        padding: 8,
        margin: 10,
    },
    explanationText: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold',
    },
    textContainer: {
        marginLeft: 4,
    },
    buttonImage: {
        width: 60,
        height: 60,
        marginTop: 10,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
        marginLeft: 4,
        resizeMode: 'contain',
    },
});

export { reviewDetailStyles };
