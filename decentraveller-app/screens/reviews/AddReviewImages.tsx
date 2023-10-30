import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { addReviewsScreenWordings } from './wording';
import DecentravellerButton from '../../commons/components/DecentravellerButton';
import { addReviewImagesStyles } from '../../styles/addReviewStyles';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { AddReviewCommentScreenProp, AddReviewImagesProps } from './types';

const imagePath1 = '../../assets/images/ar4.jpeg';
const imagePath2 = '../../assets/images/ar2.jpeg';
const imagePath3 = '../../assets/images/ar1.jpeg';
const imagePath4 = '../../assets/images/ar3.jpeg';
const imagePath5 = '../../assets/images/ar5.jpeg';
const imagePath6 = '../../assets/images/ar6.jpeg';

type CircleImageItemProps = {
    imagePath: any;
};
const circleImage: React.FC<CircleImageItemProps> = ({ imagePath }) => {
    return (
        <View style={addReviewImagesStyles.circleImage}>
            <Image source={imagePath} style={addReviewImagesStyles.image} />
        </View>
    );
};

const AddReviewImages: React.FC<AddReviewImagesProps> = ({ route }) => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const navigation = useNavigation<AddReviewCommentScreenProp>();
    const { placeId } = route.params;

    const handleImageUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission not granted');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
            });

            if (!result.canceled) {
                const selectedImages = result.assets.map((asset) => asset.uri);
                setSelectedImages(selectedImages);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const multiImageOffset = -150;

    return (
        <View style={addReviewImagesStyles.container}>
            <View style={addReviewImagesStyles.commentExampleContainer}>
                {circleImage({ imagePath: require(imagePath1) })}
                {circleImage({ imagePath: require(imagePath2) })}
                {circleImage({ imagePath: require(imagePath3) })}
                {circleImage({ imagePath: require(imagePath4) })}
                {circleImage({ imagePath: require(imagePath5) })}
                {circleImage({ imagePath: require(imagePath6) })}
            </View>
            <Text style={addReviewImagesStyles.title}>{addReviewsScreenWordings.ADD_IMAGE_TITLE}</Text>
            <View style={addReviewImagesStyles.uploadContainer}>
                <View style={addReviewImagesStyles.circleImage}>
                    <View style={addReviewImagesStyles.horizontalImageContainer}>
                        {selectedImages.length > 0 ? (
                            selectedImages.map((uri, index) => (
                                <Image
                                    key={index}
                                    source={{ uri }}
                                    style={[
                                        addReviewImagesStyles.imageUpload,
                                        {
                                            marginLeft: index > 0 ? multiImageOffset : 0,
                                        },
                                    ]}
                                />
                            ))
                        ) : (
                            <Image
                                source={require('../../assets/images/imageUpload.jpeg')}
                                style={addReviewImagesStyles.imageUpload}
                            />
                        )}
                    </View>
                    <TouchableOpacity style={addReviewImagesStyles.smallCircleButton} onPress={handleImageUpload}>
                        <Image
                            source={require('../../assets/images/pencil.png')}
                            style={addReviewImagesStyles.smallCircleImage}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <DecentravellerButton
                text={'Next'}
                loading={false}
                onPress={() => {
                    navigation.navigate('AddReviewComment', { selectedImages, placeId });
                }}
            />
        </View>
    );
};

export default AddReviewImages;
