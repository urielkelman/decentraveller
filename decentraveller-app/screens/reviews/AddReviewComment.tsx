import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addReviewsScreenWordings } from './wording';
import DecentravellerButton from '../../commons/components/DecentravellerButton';
import { addReviewCommentStyles } from '../../styles/addReviewStyles';

const imagePath1 = '../../assets/images/ar4.jpeg';

const AddReviewComment = () => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);

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
                </TouchableOpacity>
            );
        }
        return stars;
    };

    return (
        <View style={addReviewCommentStyles.container}>
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

            <DecentravellerButton
                text={'Finish'}
                loading={false}
                onPress={() => {
                    console.log('raiting=', rating);
                    console.log('text=', comment);
                }}
            />
        </View>
    );
};

export default AddReviewComment;
