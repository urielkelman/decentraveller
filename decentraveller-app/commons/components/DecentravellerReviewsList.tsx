import ReviewItem, { ReviewItemProps } from '../../screens/reviews/ReviewItem';
import { FlatList } from 'react-native';
import React from 'react';

export type ReviewShowProps = {
    id: number;
    placeId: number;
    score: number;
    text: string;
    imageCount: number;
    state: string;
    ownerNickname: string;
    ownerWallet: string;
    avatarBase64: string;
    createdAt: string;
};

const renderReviewItem = ({ item, summarized }: { item: ReviewShowProps; summarized: boolean }) => (
    <ReviewItem
        id={item.id}
        placeId={item.placeId}
        score={item.score}
        text={item.text}
        imageCount={item.imageCount}
        state={item.state}
        ownerNickname={item.ownerNickname}
        ownerWallet={item.ownerWallet}
        avatarBase64={item.avatarBase64}
        createdAt={item.createdAt}
        summarized={summarized}
    />
);

export type ReviewItemsProps = {
    reviews: ReviewShowProps[];
    summarized: boolean;
};

const DecentravellerReviewsItems: React.FC<ReviewItemsProps> = ({ reviews, summarized }) => {
    const internalRenderReviewItem = ({ item }: { item: ReviewShowProps }) =>
        renderReviewItem({ item: item, summarized: summarized });

    return <FlatList data={reviews} renderItem={internalRenderReviewItem} />;
};

export { DecentravellerReviewsItems, renderReviewItem };
