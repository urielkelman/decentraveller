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
});

export { reviewDetailStyles };
