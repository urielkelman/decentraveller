import React, {useState} from 'react';
import { Button, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useConnectionContext } from '../../context/AppContext';
import WalletConnectProvider from "@walletconnect/web3-provider";
// import { providers } from "ethers";

const ConnectWalletScreen = () => {
    const connector = useWalletConnect();
    const appContext = useConnectionContext();
    const [hasMadeSubscriptions, setHasMadeSubscriptions] = useState(false);

    const connectWallet = React.useCallback(() => {
        return connector.connect();
    }, [connector]);

    React.useEffect(() => {
        if (connector.connected) {
            appContext.setConnectionContext({
                connectedAddress: connector.accounts[0],
                connectedChainId: connector.chainId,
            });
        }
    }, [connector])

    React.useEffect(() => {
        console.log(connector.on !== undefined)
        console.log(hasMadeSubscriptions)

        const connectToProvider = async () => {
            //  Create WalletConnect Provider
            const provider = new WalletConnectProvider({
                rpc: {
                    5: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                },
                chainId: 5,
                connector: connector,
                qrcode: false,
            });

            //  Enable session (triggers QR Code modal)
            await provider.enable();
            // const web3Provider = new providers.Web3Provider(provider);

            provider.on("chainChanged", (chainId: number) => {
                console.log(chainId);
            });

            console.log('subscription done')
        }

        if(!hasMadeSubscriptions && connector.on !== undefined && connector.connected) {
            setHasMadeSubscriptions(true)
            connectToProvider().catch(e => console.error(e))
        }
    })

    /*console.log('connector is', connector)
    console.log('on is: ',connector.on)*/

    return (
        <View>
            <Button title={'Login'} onPress={connectWallet} />
        </View>
    );
};

export default ConnectWalletScreen;
