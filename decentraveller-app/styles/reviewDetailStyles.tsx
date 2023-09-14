import { Dimensions, StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_CONTRAST_COLOR } from '../commons/global';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const reviewDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F0F0F0',
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
    },
    optionsContainer: {
        paddingHorizontal: 10,
        alignItems: 'flex-end',
    },
    optionDenounce: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    denounceText: {
        fontSize: 18,
        fontFamily: 'Montserrat_400Regular',
        fontWeight: 'bold',
        color: DECENTRAVELLER_DEFAULT_CONTRAST_COLOR,
    },
    denounceIcon: {
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
        color: DECENTRAVELLER_DEFAULT_CONTRAST_COLOR,
    },
});

export { reviewDetailStyles };
