import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { ReviewScreenProps } from './types';
import { apiAdapter } from '../../api/apiAdapter';
import LoadingComponent from '../../commons/components/DecentravellerLoading';
import { PlaceResponse } from '../../api/response/places';
import { PlaceShowProps } from '../../commons/components/DecentravellerPlacesList';
import { ReviewShowProps } from '../../commons/components/DecentravellerReviewsList';
import PlaceItem from '../home/place/PlaceItem';
import { reviewDetailStyles } from '../../styles/reviewDetailStyles';
import ReviewItem from './ReviewItem';
import { useAppContext } from '../../context/AppContext';
import { moderationService } from '../../blockchain/service/moderationService';
import DecentravellerButton from '../../commons/components/DecentravellerButton';
import { communityScreenStyles, ruleDetailStyles } from '../../styles/communityStyles';
import { reviewDetailScreenWordings } from './wording';
import { BlockchainReviewStatus } from '../../blockchain/types';
import { UserRole } from '../users/profile/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackScreens } from '../home/HomeNavigator';

const adapter = apiAdapter;

const ReviewDetailScreen: React.FC<ReviewScreenProps> = ({ route }) => {
    const { reviewId, placeId } = route.params;
    const [loading, setLoading] = React.useState<boolean>(true);
    const [review, setReview] = React.useState<ReviewShowProps>(null);
    const [place, setPlace] = React.useState<PlaceShowProps>(null);
    const [censorStatus, setCensorStatus] = React.useState<BlockchainReviewStatus>(null);
    const { web3Provider, userRole, connectionContext } = useAppContext();
    const { connectedAddress } = connectionContext;
    const navigation = useNavigation<NavigationProp<HomeStackScreens>>();

    const parsePlaceResponse = (placeResponse: PlaceResponse): PlaceShowProps => {
        return {
            id: placeResponse.id,
            name: placeResponse.name,
            address: placeResponse.address,
            latitude: placeResponse.latitude,
            longitude: placeResponse.longitude,
            score: placeResponse.score,
            category: placeResponse.category,
            reviewCount: placeResponse.reviews,
        };
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const placeData = await adapter.getPlace(placeId, () => {});
            const placeToShow = parsePlaceResponse(placeData);
            const reviewData = await adapter.getReview(placeId, reviewId, () => {});
            const avatarUrl = adapter.getProfileAvatarUrl(reviewData.owner.owner);
            const reviewAddress = await moderationService.getReviewAddress(web3Provider, placeId, reviewId);
            const blockchainCensorStatus = await moderationService.getReviewCensorStatus(web3Provider, reviewAddress);
            const reviewToShow: ReviewShowProps = {
                id: reviewData.id,
                placeId: reviewData.placeId,
                score: reviewData.score,
                text: reviewData.text,
                imageCount: reviewData.imageCount,
                status: reviewData.status,
                ownerNickname: reviewData.owner.nickname,
                ownerWallet: reviewData.owner.owner,
                avatarUrl: avatarUrl,
                createdAt: reviewData.createdAt,
            };
            setPlace(placeToShow);
            setReview(reviewToShow);
            setCensorStatus(blockchainCensorStatus);
            setLoading(false);
        })();
    }, []);

    const censorComponent = () => {
        return (
            <View>
                <View style={reviewDetailStyles.optionButtonContainer}>
                    <DecentravellerButton
                        text={'Censor ⚑'}
                        onPress={() => {
                            navigation.navigate('SelectBrokenRuleScreen', { reviewId: reviewId, placeId: placeId });
                        }}
                        loading={false}
                        enabled={true}
                    />
                </View>
                <View style={communityScreenStyles.cardContainer}>
                    <View style={ruleDetailStyles.cardContent}>
                        <Image source={require('../../assets/images/info.png')} style={ruleDetailStyles.icon} />
                        <View style={ruleDetailStyles.textContainer}>
                            <Text style={ruleDetailStyles.headerText}>Why do I see this?</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={ruleDetailStyles.explanationText}>
                                    {reviewDetailScreenWordings.CENSOR_STATUS_LABEL}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const onDisputeComponent = () => {
        return (
            <View>
                <View style={communityScreenStyles.cardContainer}>
                    <View style={ruleDetailStyles.cardContent}>
                        <Image source={require('../../assets/images/exclamation.png')} style={ruleDetailStyles.icon} />
                        <View style={ruleDetailStyles.textContainer}>
                            <Text style={ruleDetailStyles.headerText}>Censor under dispute</Text>
                        </View>
                    </View>
                </View>
                <View style={communityScreenStyles.cardContainer}>
                    <View style={ruleDetailStyles.cardContent}>
                        <Image source={require('../../assets/images/info.png')} style={ruleDetailStyles.icon} />
                        <View style={ruleDetailStyles.textContainer}>
                            <Text style={ruleDetailStyles.headerText}>Why do I see this?</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={ruleDetailStyles.explanationText}>
                                    {reviewDetailScreenWordings.ON_DISPUTE_STATUS_LABEL}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const disputeComponent = () => {
        return (
            <View>
                <View style={communityScreenStyles.cardContainer}>
                    <View style={ruleDetailStyles.cardContent}>
                        <Image source={require('../../assets/images/exclamation.png')} style={ruleDetailStyles.icon} />
                        <View style={ruleDetailStyles.textContainer}>
                            <Text style={ruleDetailStyles.headerText}>Review not visible</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={ruleDetailStyles.explanationText}>
                                    {'You have been censored by moderator'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={reviewDetailStyles.optionButtonContainer}>
                        <DecentravellerButton
                            text={'Dispute'}
                            onPress={() => {
                                navigation.navigate('AddReviewComment');
                            }}
                            loading={false}
                            enabled={true}
                        />
                    </View>
                </View>
                <View style={communityScreenStyles.cardContainer}>
                    <View style={ruleDetailStyles.cardContent}>
                        <Image source={require('../../assets/images/info.png')} style={ruleDetailStyles.icon} />
                        <View style={ruleDetailStyles.textContainer}>
                            <Text style={ruleDetailStyles.headerText}>Why do I see this?</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={ruleDetailStyles.explanationText}>
                                    {reviewDetailScreenWordings.DISPUTE_STATUS_LABEL}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderByStatusAndRole = () => {
        const role = userRole.value;

        switch (censorStatus) {
            case BlockchainReviewStatus.PUBLIC:
                return role == UserRole.MODERATOR ? censorComponent() : null;
            case BlockchainReviewStatus.ON_DISPUTE:
                return role == UserRole.NORMAL && review.ownerWallet != connectedAddress ? onDisputeComponent() : null;
            case BlockchainReviewStatus.CENSORED:
                return role == UserRole.NORMAL && review.ownerWallet == connectedAddress ? disputeComponent() : null;
            default:
                return null;
        }
    };
    return loading ? (
        <LoadingComponent />
    ) : (
        <View style={reviewDetailStyles.container}>
            <View style={reviewDetailStyles.placeDataContainer}>
                <Text style={reviewDetailStyles.title}>Review of:</Text>
                <PlaceItem
                    id={place.id}
                    name={place.name}
                    address={place.address}
                    latitude={place.latitude}
                    longitude={place.longitude}
                    score={place.score}
                    category={place.category}
                    reviewCount={place.reviewCount}
                    minified={true}
                />
            </View>
            <View style={reviewDetailStyles.reviewContainer}>
                <ReviewItem
                    id={review.id}
                    placeId={review.placeId}
                    score={review.score}
                    text={review.text}
                    imageCount={review.imageCount}
                    status={review.status}
                    ownerNickname={review.ownerNickname}
                    ownerWallet={review.ownerWallet}
                    avatarUrl={review.avatarUrl}
                    createdAt={review.createdAt}
                    summarized={false}
                />
            </View>
            {renderByStatusAndRole()}
        </View>
    );
};

export default ReviewDetailScreen;
