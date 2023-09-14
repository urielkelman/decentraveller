import { Image, Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { placeReviewsBoxStyles } from '../../styles/placeDetailStyles';
import { apiAdapter } from '../../api/apiAdapter';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageGallery } from '@georstat/react-native-image-gallery';

const adapter = apiAdapter;

const ReviewImageContainer: React.FC<{ reviewId: number; placeId: number; imageCount: number }> = ({
    reviewId,
    placeId,
    imageCount,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialIndex, setinitialIndex] = useState(0);
    const openGallery = (id) => {
        setinitialIndex(id);
        setIsOpen(true);
    };
    const closeGallery = () => setIsOpen(false);

    const renderImage = ({ item }: { item }) => (
        <TouchableOpacity
            style={placeReviewsBoxStyles.imageContainer}
            onPress={() => {
                openGallery(item.id);
            }}
        >
            <Image
                style={placeReviewsBoxStyles.image}
                source={{ uri: item.url }}
                height={100}
                width={100}
                resizeMethod={'auto'}
            />
        </TouchableOpacity>
    );

    const imagesData = Array.from(Array(imageCount).keys()).map((i) => {
        return { id: i, url: adapter.getReviewImageUrl(placeId, reviewId, i + 1) };
    });

    if (imageCount > 0) {
        return (
            <TouchableOpacity activeOpacity={1} style={placeReviewsBoxStyles.imagesContainer}>
                <FlatList
                    style={placeReviewsBoxStyles.imageFlatList}
                    data={imagesData}
                    renderItem={renderImage}
                    horizontal={true}
                    scrollEnabled={true}
                    keyExtractor={(item) => item.url}
                />
                <LinearGradient
                    style={placeReviewsBoxStyles.moreImages}
                    colors={['rgba(240,240,240,1)', 'transparent']}
                    start={{ x: 0.8, y: 1.0 }}
                    end={{ x: 0.0, y: 1.0 }}
                ></LinearGradient>
                <ImageGallery close={closeGallery} isOpen={isOpen} images={imagesData} initialIndex={initialIndex} />
            </TouchableOpacity>
        );
    }

    return null;
};

export default ReviewImageContainer;
