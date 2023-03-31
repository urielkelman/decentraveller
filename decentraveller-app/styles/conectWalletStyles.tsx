import { StyleSheet, TextStyle, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

console.log(height, width);

const connectWalletScreenTextStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.75,
    },
    title: {
        fontFamily: 'Dosis_600SemiBold',
        fontSize: height / 13,
        fontWeight: '600',
    },
    blackText: {
        color: 'black',
    },
    redText: {
        color: '#D13B3B',
    },
});

const discoverTextStyle: TextStyle = {
    fontSize: height * 0.025,
    marginTop: height * 0.055,
    paddingBottom: height * 0.027,
    textAlign: 'center',
    fontWeight: 'bold',
};

const wholeScreenViewStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
});

const imageViewStyle = StyleSheet.create({
    container: {
        flex: 4.52,
        flexDirection: 'column',
    },
    semicircle: {
        borderTopStartRadius: width / 2,
        borderTopEndRadius: width / 2,
        // borderRadius: 50,
        width: width * 0.8,
        height: height * 0.2,
        transform: [{ scaleX: 2 }],
        backgroundColor: '#FFE1E1',
        // backgroundColor: 'blue',
        marginBottom: -height * 0.16,
    },
    image: {
        width: width,
        height: height * 0.5,
        flex: 4.52,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
});

const connectWalletScreenViewStyle = StyleSheet.create({
    container: {
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE1E1',
        paddingTop: height * 0.032,
    },
});

const connectWalletButtonStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: height * 0.035,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        height: height / 12,
        backgroundColor: '#983B46',
        width: width * 0.8,
        minHeight: height * 0.06,
        margin: height * 0.01,
        borderRadius: width * 0.03,
    },
    buttonLogoView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 2,
        margin: height * 0.01,
    },
    buttonTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 8,
        marginRight: width * 0.1,
    },
    text: {
        color: 'white',
        fontFamily: 'Montserrat_800ExtraBold',
        fontWeight: 'bold',
        fontSize: height * 0.029,
        lineHeight: height * 0.03,
    },
    logo: {
        width: height * 0.05,
        height: height * 0.05,
    },
});

export {
    connectWalletScreenTextStyle,
    connectWalletScreenViewStyle,
    discoverTextStyle,
    connectWalletButtonStyle,
    imageViewStyle,
    wholeScreenViewStyle,
};
