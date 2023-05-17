import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFE1E1',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
    },
    modalText: {
        fontSize: height * 0.025,
        fontFamily: 'Dosis_600SemiBold',
        marginBottom: 16,
    },
    modalButton: {
        alignItems: 'center',
        backgroundColor: '#983B46',
        width: width * 0.3,
        borderRadius: width * 0.02,
    },
    modalButtonText: {
        color: 'white',
        fontFamily: 'Montserrat_700Bold',
        fontSize: height * 0.02,
        margin: height * 0.015,
    },
});

export { modalStyles };
