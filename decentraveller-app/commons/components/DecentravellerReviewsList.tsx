import { ReviewResponse } from '../../api/response/reviews';
import ReviewItem from '../../screens/reviews/ReviewItem';
import { FlatList } from 'react-native';
import React from 'react';

const renderReviewItem = ({ item }: { item: ReviewResponse }) => (
    <ReviewItem
        id={item.id}
        placeId={item.placeId}
        score={item.score}
        text={item.text}
        imageCount={item.imageCount}
        state={item.state}
        ownerNickname={item.owner.nickname}
        createdAt={item.createdAt}
    />
);

export type ReviewItemsProps = {
    reviews: ReviewResponse[];
};

const DecentravellerReviewsItems: React.FC<ReviewItemsProps> = ({ reviews }) => (
    <FlatList data={reviews} renderItem={renderReviewItem} />
);

export default DecentravellerReviewsItems;
