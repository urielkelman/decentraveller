import {StyleSheet, TextStyle, Dimensions} from "react-native";


const { height, width } = Dimensions.get('window');

const decentravellerTextStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.75,
    },
    title: {
        fontSize: 100,
        fontWeight: 'bold',
        textAlign: 'justify',
    },
    blackText: {
        color: 'black',
        fontFamily: 'Dosis',
        fontWeight: 'bold',
    },
    redText: {
        color: '#D13B3B',
        fontFamily: 'Dosis',
        fontWeight: 'bold'
    },
});

const discoverTextStyle: TextStyle = {
    fontSize: decentravellerTextStyle.title.fontSize / 4,
    paddingTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
};

const connectWalletScreenViewStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export { decentravellerTextStyle, connectWalletScreenViewStyle, discoverTextStyle };