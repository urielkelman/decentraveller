import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');

const addPlaceHeadingTextStyles = StyleSheet.create({
    text: {
        color: 'black',
        fontFamily: 'Montserrat_800ExtraBold',
        fontWeight: 'bold',
        fontSize: height * 0.042,
        lineHeight: height * 0.055,
        textAlign: 'center',
        marginTop: height * 0.07,
        marginRight: width * 0.04,
        marginLeft: width * 0.04,
    },
});

const addPlaceDescriptionTextStyles = StyleSheet.create({
    text: {
        color: 'black',
        fontFamily: 'Montserrat_800ExtraBold',
        fontWeight: 'bold',
        fontSize: height * 0.024,
        lineHeight: height * 0.04,
        textAlign: 'center',
        margin: width * 0.04,
    },
});

const addPlaceScreenStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE1E1',
    },
});

const addPlaceIndicationTextStyles = StyleSheet.create({
    container: {},
    text: {
        fontSize: height * 0.024,
        fontFamily: 'Montserrat_400Regular',
        color: '#676666',
        display: 'flex',
        flexDirection: 'row',
    },
});

export { addPlaceHeadingTextStyles, addPlaceDescriptionTextStyles, addPlaceScreenStyles, addPlaceIndicationTextStyles };
