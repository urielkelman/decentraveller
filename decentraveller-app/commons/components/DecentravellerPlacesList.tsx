import PlaceItem from '../../screens/home/place/PlaceItem';
import { FlatList, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { DecentravellerPlaceCategory } from '../../context/types';
import { placeReviewsBoxStyles } from '../../styles/placeDetailStyles';
import LoadingComponent from './DecentravellerLoading';
import { ReviewShowProps } from './DecentravellerReviewsList';

export type PlaceShowProps = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    score: number;
    category: DecentravellerPlaceCategory;
    reviewCount: number;
    imageUri: string | null;
};

const renderPlaceItem = ({ item, minified }: { item: PlaceShowProps; minified: boolean }) => (
    <PlaceItem
        id={item.id}
        name={item.name}
        address={item.address}
        category={item.category}
        latitude={item.latitude}
        longitude={item.longitude}
        score={item.score}
        reviewCount={item.reviewCount}
        imageUri={item.imageUri}
        minified={minified}
    />
);

interface LoadPlaceResponse {
    total: number;
    placesToShow: PlaceShowProps[];
}

type PlaceLoadFunction = (offset: number, limit: number) => Promise<LoadPlaceResponse>;

export type PlacesItemsProps = {
    placeList?: PlaceShowProps[] | null | undefined;
    loadPlaces?: PlaceLoadFunction | null | undefined;
    minified: boolean;
    horizontal: boolean;
};

const DecentravellerPlacesList: React.FC<PlacesItemsProps> = ({ placeList, loadPlaces, minified, horizontal }) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [places, setPlaces] = React.useState<PlaceShowProps[]>(null);
    const [placeCount, setPlacesCount] = React.useState<number>(0);

    const hasPlaces = () => {
        return places != null && places.length > 0;
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            console.log(loadPlaces);
            if (placeList != undefined) {
                const total = placeList.length;
                setPlaces(placeList);
                setPlacesCount(total);
            } else if (loadPlaces != undefined) {
                const { total, placesToShow } = await loadPlaces(0, 5);
                setPlaces(placesToShow);
                setPlacesCount(total);
            }
            setLoading(false);
        })();
    }, []);

    const loadMore = async () => {
        if (hasPlaces() && placeCount > places.length) {
            setLoading(true);
            const { total, placesToShow } = await loadPlaces((places.length / 5) | 0, 5);
            places.push.apply(places, placesToShow);
            setLoading(false);
        }
    };

    const footerComponent = () => {
        return (
            <View style={placeReviewsBoxStyles.reviewsFooter}>
                {!hasPlaces() ? <Text>No places found.</Text> : null}
                {hasPlaces() && placeCount > places.length ? <LoadingComponent /> : null}
            </View>
        );
    };

    const placesBoxComponent = () => {
        const internalRenderPlaceItem = ({ item }: { item: PlaceShowProps }) =>
            renderPlaceItem({ item: item, minified: minified });

        return (
            <FlatList
                data={places}
                renderItem={internalRenderPlaceItem}
                horizontal={horizontal}
                keyExtractor={(item, index) => String(index)}
                ListFooterComponent={footerComponent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
            />
        );
    };

    return loading && !hasPlaces() ? <LoadingComponent /> : placesBoxComponent();
};

export { DecentravellerPlacesList, LoadPlaceResponse, PlaceLoadFunction };
