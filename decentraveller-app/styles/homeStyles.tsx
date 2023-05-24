import { Dimensions, StyleSheet } from 'react-native';

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
});

const addNewPlaceIconSize = width * 0.06;

export { homeStyle, addNewPlaceIconSize };
