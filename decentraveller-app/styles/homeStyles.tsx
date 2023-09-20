import { Dimensions, StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR, DECENTRAVELLER_DEFAULT_CONTRAST_COLOR } from '../commons/global';

const { height, width } = Dimensions.get('window');

const homeStyle = StyleSheet.create({
    addNewPlaceReference: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.12,
        height: width * 0.12,
        backgroundColor: '#983B46',
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: width * 0.06,
        zIndex: 1,
        borderRadius: width * 0.2,
    },
    homeContainer: {
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
        flex: 1,
    },
    title: {
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
        backgroundColor: 'white',
        fontFamily: 'Montserrat_700Bold',
        zIndex: 10,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 13,
        shadowColor: '#000',
        elevation: 30,
    },
    map: {
        width: '100%',
        height: height * 0.3,
    },
    mapMarker: {
        padding: 4,
        flex: 1,
        width: 38,
        height: 38,
    },
    bubbleImage: {
        position: 'absolute',
        width: 38,
        height: 38,
    },
    mapImage: {
        width: 30,
        height: 20,
        borderRadius: 5,
    },
});

const addNewPlaceIconSize = width * 0.06;

export { homeStyle, addNewPlaceIconSize };
