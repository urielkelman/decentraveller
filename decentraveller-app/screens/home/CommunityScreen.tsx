import { Button, Text, View } from 'react-native';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const CommunityScreen = ({ navigation }) => {
    const { provider } = useWalletConnectModal();
    const killSession = async () => {
        await provider?.disconnect();
        console.log('session killed');
    };

    return (
        <View style={{ flex: 1 }}>
            <Button title={'Disconnect wallet'} onPress={killSession} />
            <Text>Community</Text>
        </View>
    );
};

export default CommunityScreen;
