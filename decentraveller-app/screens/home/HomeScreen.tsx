import { Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';
import React, { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { apiAdapter } from '../../api/apiAdapter';
import { mockApiAdapter } from '../../api/mockApiAdapter';
import { PlaceResponse, PlacesResponse } from '../../api/response/places';
import PlaceItem from './place/PlaceItem';
import { addNewPlaceIconSize, homeStyle } from '../../styles/homeStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const adapter = mockApiAdapter;

const HomeScreen = ({ navigation }) => {
    const connector = useWalletConnect();
    const appContext = useAppContext();
    const [loadingRecommendedPlaces, setLoadingRecommendedPlaces] = React.useState<boolean>(false);
    const [recommendedPlaces, setRecommendedPlaces] = React.useState<PlaceResponse[]>([]);

    const killSession = async () => {
        appContext.cleanConnectionContext();
        await connector.killSession();
        console.log('session killed');
    };

    useEffect(() => {
        (async () => {
            setLoadingRecommendedPlaces(true);
            const recommendedPlacesResponse: PlacesResponse = await adapter.getRecommendedPlaces(
                // appContext.connectionContext.connectedAddress
                ''
            );
            setLoadingRecommendedPlaces(false);
            setRecommendedPlaces(recommendedPlacesResponse.results);
        })();
    }, []);

    const renderPlaceItem = ({ item }: { item: PlaceResponse }) => (
        <PlaceItem
            id={item.id}
            name={item.name}
            address={item.address}
            category={item.category}
            latitude={item.latitude}
            longitude={item.longitude}
            score={item.score}
            reviewCount={item.reviewCount}
        />
    );

    const recommendedPlacesItems = () => (
        <View style={{ backgroundColor: '#FFE1E1', flex: 1 }}>
            <View style={homeStyle.addNewPlaceReference}>
                <TouchableOpacity onPress={() => navigation.navigate('CreatePlaceNameScreen')}>
                    <MaterialCommunityIcons name="book-plus-outline" size={addNewPlaceIconSize} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList data={recommendedPlaces} renderItem={renderPlaceItem} />
        </View>
    );

    const loadingRecommendedPlacesComponent = () => (
        <View>
            <Text>Loading</Text>
        </View>
    );

    const componentToRender = loadingRecommendedPlaces ? loadingRecommendedPlacesComponent() : recommendedPlacesItems();

    return <View style={{ flex: 1 }}>{componentToRender}</View>;
};

export default HomeScreen;
