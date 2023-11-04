import ReviewItem from '../../screens/reviews/ReviewItem';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { placeReviewsBoxStyles } from '../../styles/placeDetailStyles';
import LoadingComponent from './DecentravellerLoading';
import { BackendReviewStatus, BlockchainProposalStatus, BlockchainReviewStatus } from '../../blockchain/types';

export type ReviewShowProps = {
    id: number;
    placeId: number;
    score: number;
    text: string;
    imageCount: number;
    status: BackendReviewStatus;
    ownerNickname: string;
    ownerWallet: string;
    avatarUrl: string;
    createdAt: string;
};

const renderReviewItem = ({ item, summarized }: { item: ReviewShowProps; summarized: boolean }) => (
    <ReviewItem
        id={item.id}
        placeId={item.placeId}
        score={item.score}
        text={item.text}
        imageCount={item.imageCount}
        status={item.status}
        ownerNickname={item.ownerNickname}
        ownerWallet={item.ownerWallet}
        avatarUrl={item.avatarUrl}
        createdAt={item.createdAt}
        summarized={summarized}
    />
);

interface LoadReviewResponse {
    total: number;
    reviewsToShow: ReviewShowProps[];
}

type ReviewLoadFunction = (offset: number, limit: number) => Promise<LoadReviewResponse>;

export type ReviewItemsProps = {
    reviewList?: ReviewShowProps[] | null | undefined;
    loadReviews?: ReviewLoadFunction | null | undefined;
    summarized: boolean;
    footer?: React.ComponentType<any> | React.ReactElement<unknown> | null;
};

const DecentravellerReviewsItems: React.FC<ReviewItemsProps> = ({ reviewList, loadReviews, summarized, footer }) => {
    const [loadingReviews, setLoadingReviews] = React.useState<boolean>(false);
    const [reviews, setReviews] = React.useState<ReviewShowProps[]>(null);
    const [reviewCount, setReviewsCount] = React.useState<number>(0);

    useEffect(() => {
        (async () => {
            setLoadingReviews(true);
            if (reviewList != null) {
                const total = reviewList.length;
                setReviews(reviewList);
                setReviewsCount(total);
            } else if (loadReviews != undefined) {
                const { total, reviewsToShow } = await loadReviews(0, 5);
                setReviews(reviewsToShow);
                setReviewsCount(total);
            }
            setLoadingReviews(false);
        })();
    }, []);

    const loadMoreReviews = async () => {
        if (hasReviews() && reviewCount > reviews.length) {
            setLoadingReviews(true);
            const { total, reviewsToShow } = await loadReviews((reviews.length / 5) | 0, 5);
            reviews.push.apply(reviews, reviewsToShow);
            setLoadingReviews(false);
        }
    };

    const loadingReviewsComponent = () => (
        <View
            style={[
                placeReviewsBoxStyles.container,
                {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                },
            ]}
        >
            <View style={placeReviewsBoxStyles.reviewsHeader}>
                <View style={placeReviewsBoxStyles.titleContainer}>
                    <Text style={placeReviewsBoxStyles.titleText}>Reviews</Text>
                </View>
                <ActivityIndicator size={'large'} />
            </View>
        </View>
    );

    const hasReviews = () => {
        return reviews && reviews.length > 0;
    };

    const footerComponent = () => {
        return (
            <View>
                {!hasReviews() ? <Text style={{ padding: 5, fontSize: 18 }}>No reviews found.</Text> :
                    reviewCount > reviews.length ? <LoadingComponent /> : null}
            </View>
        );
    };

    const headerComponent = () => {
        return hasReviews() ?
            (<View style={placeReviewsBoxStyles.reviewsHeader}>
                <View style={placeReviewsBoxStyles.titleContainer}>
                    <Text style={placeReviewsBoxStyles.titleText}>Reviews ({reviewCount})</Text>
                </View>
            </View>
        ) : null;
    };

    const reviewsBoxComponent = () => {
        const internalRenderReviewItem = ({ item }: { item: ReviewShowProps }) =>
            renderReviewItem({ item: item, summarized: false });

        return (
            <FlatList
                data={reviews}
                onEndReached={loadMoreReviews}
                onEndReachedThreshold={0.1}
                style={[
                    placeReviewsBoxStyles.container,
                    {
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                    },
                ]}
                keyExtractor={(item, index) => String(index)}
                ListHeaderComponent={headerComponent}
                stickyHeaderIndices={[0]}
                ListFooterComponent={footer != null ? footer : footerComponent}
                renderItem={internalRenderReviewItem}
                scrollEnabled={true}
            ></FlatList>
        );
    };

    return loadingReviews && !hasReviews() ? loadingReviewsComponent() : reviewsBoxComponent();
};

export { DecentravellerReviewsItems, renderReviewItem, LoadReviewResponse, ReviewLoadFunction };
