import React from 'react';
import { TouchableOpacity, Text, View, ImageBackground, Image } from 'react-native';
import {DEFAULT_CHAIN_ID, useAppContext} from '../../context/AppContext';
import {
    connectWalletScreenTextStyle,
    connectWalletScreenViewStyle,
    discoverTextStyle,
    connectWalletButtonStyle,
    wholeScreenViewStyle,
    imageViewStyle,
} from '../../styles/conectWalletStyles';
import { useWalletConnectModal, WalletConnectModal } from '@walletconnect/modal-react-native';
import { IProviderMetadata } from '@walletconnect/modal-react-native';

export const providerMetadata: IProviderMetadata = {
    name: 'React Native V2 dApp',
    description: 'RN dApp by WalletConnect',
    url: 'https://walletconnect.com/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
        native: 'w3msample://',
    },
};

export const sessionParams = {
    namespaces: {
        eip155: {
            methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
            chains: [`eip155:${DEFAULT_CHAIN_ID}`],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: {},
        },
    },
};

const ConnectWalletScreen = () => {
    const { provider, open } = useWalletConnectModal();

    const connectWallet = async () => {
        console.log('Trying to connect....');
        try {
            return await open();
        } catch (e) {
            console.error('Error when requesting wallet connection', e);
        }
    };

    return (
        <View style={wholeScreenViewStyle.container}>
            <View style={imageViewStyle.container}>
                <ImageBackground source={require('../../assets/images/init_image.png')} style={imageViewStyle.image}>
                    <View style={imageViewStyle.semicircle} />
                </ImageBackground>
            </View>
            <View style={connectWalletScreenViewStyle.container}>
                <View style={connectWalletScreenTextStyle.container}>
                    <Text style={connectWalletScreenTextStyle.title} adjustsFontSizeToFit={true} numberOfLines={1}>
                        <Text style={connectWalletScreenTextStyle.blackText}>Decen</Text>
                        <Text style={connectWalletScreenTextStyle.redText}>Traveller</Text>
                    </Text>
                    <Text style={discoverTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                        Discover a new way of traveling, more shared, more fair, more decentralized.
                    </Text>
                </View>
                <View style={connectWalletButtonStyle.container}>
                    <TouchableOpacity style={connectWalletButtonStyle.button} onPress={connectWallet}>
                        <View style={connectWalletButtonStyle.buttonLogoView}>
                            <Image
                                source={require('../../assets/logos/metamask.png')}
                                style={connectWalletButtonStyle.logo}
                            />
                        </View>
                        <View style={connectWalletButtonStyle.buttonTextView}>
                            <Text style={connectWalletButtonStyle.text}>Connect wallet</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={connectWalletButtonStyle.button}>
                        <View style={connectWalletButtonStyle.buttonLogoView}>
                            <Image
                                source={require('../../assets/logos/mandala.png')}
                                style={connectWalletButtonStyle.logo}
                            />
                        </View>
                        <View style={connectWalletButtonStyle.buttonTextView}>
                            <Text style={connectWalletButtonStyle.text}>Why DecenTraveller?</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <WalletConnectModal
                projectId={'0796da7712aba2acab6735c1c6091a82'}
                providerMetadata={providerMetadata}
                sessionParams={sessionParams}
            />
        </View>
    );
};

export default ConnectWalletScreen;
