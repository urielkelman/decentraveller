import React from 'react';
import { TouchableOpacity, Text, View, ImageBackground, Image } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import {
    connectWalletScreenTextStyle,
    connectWalletScreenViewStyle,
    discoverTextStyle,
    connectWalletButtonStyle,
    wholeScreenViewStyle,
    imageViewStyle,
} from '../../styles/conectWalletStyles';
import { useWalletConnectModal, WalletConnectModal } from '@walletconnect/modal-react-native';
import { clientMeta, sessionParams, WALLET_CONNECT_PROJECT_ID } from '../../config/walletConnectConfig';

const ConnectWalletScreen = () => {
    const { open } = useWalletConnectModal();

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
                projectId={WALLET_CONNECT_PROJECT_ID}
                providerMetadata={clientMeta}
                sessionParams={sessionParams}
            />
        </View>
    );
};

export default ConnectWalletScreen;
