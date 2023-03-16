import { StyleSheet, TextStyle, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const connectWalletScreenTextStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.75,
    },
    title: {
        fontSize: 100,
        fontWeight: 'bold',
    },
    blackText: {
        color: 'black',
        fontFamily: 'Dosis',
        fontWeight: 'bold',
    },
    redText: {
        color: '#D13B3B',
        fontFamily: 'Dosis',
        fontWeight: 'bold',
    },
});

const discoverTextStyle: TextStyle = {
    fontSize: connectWalletScreenTextStyle.title.fontSize / 4,
    paddingTop: height * 0.03,
    textAlign: 'center',
    fontWeight: 'bold',
};

const wholeScreenViewStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    }

})

const imageViewStyle = StyleSheet.create({
    container: {
        flex: 6,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE1E1'
    },
})


const connectWalletScreenViewStyle = StyleSheet.create({
    container: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE1E1'
    },
});

const connectWalletButtonStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        height: height * 0.05,
        backgroundColor: '#983B46',
        width: width * 0.8,
        minHeight: height * 0.06,
        margin: height * 0.015,
        padding: height * 0.01,
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
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        fontSize: height * 0.025,
    },
    logo: {
        width: height * 0.05,
        height: height * 0.05,
    }
});

export { connectWalletScreenTextStyle, connectWalletScreenViewStyle, discoverTextStyle, connectWalletButtonStyle, imageViewStyle, wholeScreenViewStyle };
