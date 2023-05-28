import { PlaceResponse } from '../../api/response/places';
import PlaceItem from '../../screens/home/place/PlaceItem';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { addNewPlaceIconSize, homeStyle } from '../../styles/homeStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

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

const recommendedPlacesItems = ({ recommendedPlaces, shouldRenderAddNewPlace }) => {
    const navigation = useNavigation();

    return (
        <View style={{ backgroundColor: '#FFE1E1', flex: 1 }}>
            {shouldRenderAddNewPlace && (
                <View style={homeStyle.addNewPlaceReference}>
                    <TouchableOpacity onPress={() => navigation.navigate('CreatePlaceNameScreen')}>
                        <MaterialCommunityIcons name="book-plus-outline" size={addNewPlaceIconSize} color="black" />
                    </TouchableOpacity>
                </View>
            )}
            <FlatList data={recommendedPlaces} renderItem={renderPlaceItem} />
        </View>
    );
};

export { recommendedPlacesItems };
