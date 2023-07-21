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
        marginTop: height * 0.015,
        marginRight: width * 0.04,
        marginLeft: width * 0.04,
        marginBottom: height * 0.025,
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
        marginLeft: width * 0.04,
        marginRight: width * 0.04,
        marginBottom: width * 0.04,
    },
});

const bottomTabScreenStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE1E1',
        height: '100%',
    },
});

const bottomTabIndicationTextStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginLeft: width * 0.1,
        marginRight: width * 0.1,
        marginBottom: height * 0.05,
    },
    text: {
        fontSize: height * 0.024,
        fontFamily: 'Montserrat_500Medium',
        color: '#676666',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: height * 0.01,
    },
    inputField: {
        borderRadius: 20,
        borderColor: 'white',
    },
    pickerInputField: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: height * 0.02,
    },
    textInputContainer: {
        width: '80%',
    },
    textInputField: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: height * 0.024,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: height * 0.013,
        paddingLeft: width * 0.025,
    },
});

const bottomTabButtonStyle = StyleSheet.create({
    buttonTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        height: height / 12,
            backgroundColor: '#983B46',
        width: width * 0.8,
        minHeight: height * 0.06,
        margin: height * 0.01,
        borderRadius: width * 0.06,
        marginTop: height * 0.05,
    },
    text: {
        color: 'white',
        fontFamily: 'Montserrat_800ExtraBold',
        fontWeight: 'bold',
        fontSize: height * 0.029,
        lineHeight: height * 0.03,
    },
});

export {
    addPlaceHeadingTextStyles,
    addPlaceDescriptionTextStyles,
    bottomTabScreenStyles,
    bottomTabIndicationTextStyles,
    bottomTabButtonStyle,
};
