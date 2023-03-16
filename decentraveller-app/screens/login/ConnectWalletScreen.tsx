import React from 'react';
import {Button, Text, View} from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';
import {decentravellerTextStyle, connectWalletScreenViewStyle, discoverTextStyle } from "../../styles/conectWalletStyles";

const ConnectWalletScreen = () => {
    const connector = useWalletConnect();

    const connectWallet = React.useCallback(() => {
        console.log('Trying to connect....');
        return connector.connect();
    }, [connector]);

    return (
        <View style={connectWalletScreenViewStyle.container}>
            <View style={decentravellerTextStyle.container}>
                <Text style={decentravellerTextStyle.title} adjustsFontSizeToFit={true} numberOfLines={1}>
                    <Text style={decentravellerTextStyle.blackText}>Decen</Text>
                    <Text style={decentravellerTextStyle.redText}>Traveller</Text>
                </Text>
                <Text style={discoverTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                    Discover a new way of traveling, more shared, more fair, more decentralized.
                </Text>
            </View>
        </View>
    );
};

export default ConnectWalletScreen;
