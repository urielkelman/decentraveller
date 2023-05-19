import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';
import React, {useEffect} from 'react';
import { Feather } from '@expo/vector-icons';
import {apiAdapter} from "../../api/apiAdapter";

const Home = ({ navigation }) => {
    const connector = useWalletConnect();
    const appContext = useAppContext();
    const [loadingRecommendedPlaces, setLoadingRecommendedPlaces] = React.useState<boolean>(false);
    const [recommendedPlaces, setRecommendedPlaces] = React.useState(undefined);

    const killSession = async () => {
        appContext.cleanConnectionContext();
        await connector.killSession();
        console.log('session killed');
    };

    useEffect(async () => {
        const recommendedPlacesResponse: string = await apiAdapter.getRecommendedPlaces(appContext.connectionContext.connectedAddress);

    }(), []);

    console.log('Home')

    return (
        <View style={{ flex: 1 }}>
            <Button title={'Disconnect wallet'} onPress={killSession} />
            <TouchableOpacity
                style={{ paddingTop: 35, flex: 1, flexDirection: 'row' }}
                onPress={() => navigation.navigate('CreatePlaceNameScreen', { headerShown: false })}
            >
                <Feather name="plus-circle" size={24} color="black" style={{ paddingRight: 10 }} />
                <Text>Add a place</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;
