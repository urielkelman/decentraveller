import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Image, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addReviewsScreenWordings } from './wording';
import DecentravellerButton from '../../commons/components/DecentravellerButton';
import { addReviewCommentStyles } from '../../styles/addReviewStyles';
import { RouteProp, useRoute } from '@react-navigation/native';
import { blockchainAdapter } from '../../blockchain/blockhainAdapter';
import { useAppContext } from '../../context/AppContext';
import { apiAdapter } from '../../api/apiAdapter';
import { mockApiAdapter } from '../../api/mockApiAdapter';
import DecentravellerInformativeModal from '../../commons/components/DecentravellerInformativeModal';

const adapter = blockchainAdapter;
const adapterApi = mockApiAdapter;

type AddReviewCommentParams = {
    selectedImage: string;
    placeId: number;
};

const AddReviewComment = ({ navigation }) => {
    const route = useRoute<RouteProp<Record<string, AddReviewCommentParams>, string>>();
    const { selectedImage, placeId } = route.params;
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const { connectionContext, web3Provider } = useAppContext();
    const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);

    const handleRating = (selectedRating) => {
        setRating(selectedRating);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} activeOpacity={0.7} onPress={() => handleRating(i)}>
                    <Text>
                        <Ionicons
                            name={i <= rating ? 'star' : 'star-outline'}
                            size={30}
                            color={i <= rating ? '#FFD700' : '#cc6060'}
                        />
                    </Text>
                </TouchableOpacity>,
            );
        }
        return stars;
    };

    const onClickFinish = async () => {
        const response = await adapterApi.sendReviewImage(connectionContext.connectedAddress, selectedImage, () => {
            setShowErrorModal(true);
        });

        if (!response) return;

        const imageHash = response.hash;
        const transactionHash = await adapter.addPlaceReviewTransaction(web3Provider, placeId, comment, rating, [
            imageHash,
        ]);

        if (!transactionHash) return;

        console.log('Transaction confirmed with hash', transactionHash);
        navigation.navigate('SuccessAddReviewScreen');
    };

    const handleKeyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'position' : null;

    return (
        <KeyboardAvoidingView behavior={handleKeyboardAvoidingViewBehavior} style={addReviewCommentStyles.container}>
            <Text style={addReviewCommentStyles.commentTitle}>{addReviewsScreenWordings.ADD_COMMENT_TITLE}</Text>
            <View style={addReviewCommentStyles.commentExampleContainer}>
                <Image
                    source={require('../../assets/images/example-girl.jpeg')}
                    style={addReviewCommentStyles.imageUserExample}
                />
                <View style={addReviewCommentStyles.dialogContainer}>
                    <Image source={require('../../assets/images/dialog.png')} />
                    <Text style={addReviewCommentStyles.dialogText}>
                        {addReviewsScreenWordings.EXAMPLE_COMMENT_REVIEW}
                    </Text>
                </View>
            </View>

            <Text style={addReviewCommentStyles.commentSubtitle}>{addReviewsScreenWordings.ADD_RATE}</Text>
            <View style={addReviewCommentStyles.starContainer}>{renderStars()}</View>
            <Text style={addReviewCommentStyles.commentSubtitle}>{addReviewsScreenWordings.ADD_COMMENT_SUBTITLE}</Text>
            <View style={addReviewCommentStyles.inputContainer}>
                <TextInput
                    style={addReviewCommentStyles.textInput}
                    multiline
                    placeholder="Insert comment here"
                    placeholderTextColor="gray"
                    value={comment}
                    onChangeText={setComment}
                />
            </View>

            <DecentravellerButton text={'Finish'} loading={false} onPress={onClickFinish} />
            <DecentravellerInformativeModal
                informativeText={'Error ocurred'}
                visible={showErrorModal}
                closeModalText={'Close'}
                handleCloseModal={() => setShowErrorModal(false)}
            />
        </KeyboardAvoidingView>
    );
};

export default AddReviewComment;
