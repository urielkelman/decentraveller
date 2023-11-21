import { Image, Text, TouchableOpacity, View } from 'react-native';
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
import { reviewDetailScreenWordings } from './wording';
import { BackendReviewStatus, BlockchainProposalStatus, BlockchainReviewStatus } from '../../blockchain/types';
import { UserRole } from '../users/profile/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackScreens } from '../home/HomeNavigator';
import { rulesService } from '../../blockchain/service/rulesService';

const adapter = apiAdapter;

const ReviewDetailScreen: React.FC<ReviewScreenProps> = ({ route }) => {
    const { reviewId, placeId } = route.params;
    const [loading, setLoading] = React.useState<boolean>(true);
    const [review, setReview] = React.useState<ReviewShowProps>(null);
    const [place, setPlace] = React.useState<PlaceShowProps>(null);
    const [blockchainStatus, setBlockchainStatus] = React.useState<BlockchainReviewStatus>(null);
    const [alreadyVoted, setAlreadyVoted] = React.useState<boolean>(false);
    const [jurors, setJurors] = React.useState<string[]>(null);
    const { web3Provider, userRole, connectionContext, userNickname } = useAppContext();
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

    const loadData = async () => {
        setLoading(true);
        const placeData = await adapter.getPlace(placeId, () => {});
        const placeToShow = parsePlaceResponse(placeData);
        const reviewData = await adapter.getReview(placeId, reviewId, () => {});
        const avatarUrl = adapter.getProfileAvatarUrl(reviewData.owner.owner);
        const blockchainReviewStatus =
            reviewData.status == BackendReviewStatus.PUBLIC
                ? BlockchainReviewStatus.PUBLIC
                : await moderationService.getReviewCensorStatus(web3Provider, placeId, reviewId);
        setJurors(await moderationService.getJuries(web3Provider, placeId, reviewId));
        setBlockchainStatus(blockchainReviewStatus);
        setAlreadyVoted(await moderationService.hasVotedOnDispute(web3Provider, placeId, reviewId));
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
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            await loadData();
        })();
    }, []);

    const disputeCensorship = async () => {
        await moderationService.disputeReviewCensorship(web3Provider, placeId, reviewId);
        await loadData();
    };
    const executeCensorshipRemoval = async () => {
        await moderationService.executeCensorshipRemoval(web3Provider, placeId, reviewId);
        await loadData();
    };

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
                <View style={reviewDetailStyles.cardContainer}>
                    <View style={reviewDetailStyles.cardContent}>
                        <Image source={require('../../assets/images/info.png')} style={reviewDetailStyles.icon} />
                        <View style={reviewDetailStyles.textContainer}>
                            <Text style={reviewDetailStyles.headerText}>Why do I see this?</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={reviewDetailStyles.explanationText}>
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
                <View style={reviewDetailStyles.cardContainer}>
                    <View style={reviewDetailStyles.cardContent}>
                        <Image
                            source={require('../../assets/images/exclamation.png')}
                            style={reviewDetailStyles.icon}
                        />
                        <View style={reviewDetailStyles.textContainer}>
                            <Text style={reviewDetailStyles.headerText}>Censor under dispute</Text>
                        </View>
                    </View>
                </View>
                <View style={reviewDetailStyles.cardContainer}>
                    <View style={reviewDetailStyles.cardContent}>
                        <Image source={require('../../assets/images/info.png')} style={reviewDetailStyles.icon} />
                        <View style={reviewDetailStyles.textContainer}>
                            <Text style={reviewDetailStyles.headerText}>Why do I see this?</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={reviewDetailStyles.explanationText}>
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
                <View style={reviewDetailStyles.cardContainer}>
                    <View style={reviewDetailStyles.cardContent}>
                        <Image
                            source={require('../../assets/images/exclamation.png')}
                            style={reviewDetailStyles.icon}
                        />
                        <View style={reviewDetailStyles.textContainer}>
                            <Text style={reviewDetailStyles.headerText}>Review not visible</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={reviewDetailStyles.explanationText}>
                                    {'You have been censored by moderator'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={reviewDetailStyles.optionButtonContainer}>
                        <DecentravellerButton
                            text={'Dispute'}
                            onPress={disputeCensorship}
                            loading={false}
                            enabled={true}
                        />
                    </View>
                </View>
                <View style={reviewDetailStyles.cardContainer}>
                    <View style={reviewDetailStyles.cardContent}>
                        <Image source={require('../../assets/images/info.png')} style={reviewDetailStyles.icon} />
                        <View style={reviewDetailStyles.textContainer}>
                            <Text style={reviewDetailStyles.headerText}>Why do I see this?</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={reviewDetailStyles.explanationText}>
                                    {reviewDetailScreenWordings.DISPUTE_STATUS_LABEL}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const voteComponent = () => {
        return alreadyVoted ? alreadyVotedComponent() : toVoteComponent();
    };

    const toVoteComponent = () => {
        return (
            <View>
                <View style={reviewDetailStyles.cardContainer}>
                    <View style={reviewDetailStyles.cardContent}>
                        <Image
                            source={require('../../assets/images/exclamation.png')}
                            style={reviewDetailStyles.icon}
                        />
                        <View style={reviewDetailStyles.textContainer}>
                            <Text style={reviewDetailStyles.headerText}>You are a jury!</Text>
                            <View style={{ maxWidth: '95%' }}>
                                <Text style={reviewDetailStyles.explanationText}>
                                    {reviewDetailScreenWordings.VOTE_STATUS_LABEL}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={reviewDetailStyles.cardContainer}>
                    <View style={reviewDetailStyles.textContainer}>
                        <Text style={reviewDetailStyles.headerText}>You decide about this censorship</Text>
                        <View style={{ maxWidth: '95%' }}>
                            <Text style={reviewDetailStyles.explanationText}>
                                {reviewDetailScreenWordings.VOTE_EXPLANATION_LABEL}
                            </Text>
                        </View>
                    </View>
                    <View style={reviewDetailStyles.buttonVoteContainer}>
                        <TouchableOpacity style={{ marginRight: 25 }} onPress={voteFavor}>
                            <Image
                                source={require('../../assets/images/like.png')}
                                style={reviewDetailStyles.buttonImage}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={voteAgainst}>
                            <Image
                                source={require('../../assets/images/dislike.png')}
                                style={reviewDetailStyles.buttonImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const alreadyVotedComponent = () => {
        return (
            <View style={reviewDetailStyles.cardContainer}>
                <View style={reviewDetailStyles.cardContent}>
                    <Image source={require('../../assets/images/exclamation.png')} style={reviewDetailStyles.icon} />
                    <View style={reviewDetailStyles.textContainer}>
                        <Text style={reviewDetailStyles.headerText}>You've already voted on this challenge</Text>
                    </View>
                </View>
            </View>
        );
    };
    const censorshipRemovalComponent = () => {
        return (
            <View style={reviewDetailStyles.cardContainer}>
                <View style={reviewDetailStyles.cardContent}>
                    <Image source={require('../../assets/images/favor.png')} style={reviewDetailStyles.icon} />
                    <View style={reviewDetailStyles.textContainer}>
                        <Text style={reviewDetailStyles.headerText}>This review could be back</Text>
                        <View style={{ maxWidth: '95%' }}>
                            <Text style={reviewDetailStyles.explanationText}>
                                {reviewDetailScreenWordings.UNCENSOR_LABEL}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={reviewDetailStyles.optionButtonContainer}>
                    <DecentravellerButton
                        text={'Execute'}
                        onPress={executeCensorshipRemoval}
                        loading={false}
                        enabled={true}
                    />
                </View>
            </View>
        );
    };
    const voteFavor = async () => {
        await moderationService.voteForCensorship(web3Provider, placeId, reviewId);
        await loadData();
    };
    const voteAgainst = async () => {
        await moderationService.voteAgainstCensorship(web3Provider, placeId, reviewId);
        await loadData();
    };

    const renderByStatusAndRole = () => {
        const role = userRole.value;

        // Votacion
        // return voteComponent();

        // Challengear
        // return disputeComponent();

        // Remover censura
        // return censorshipRemovalComponent();

        switch (blockchainStatus) {
            case BlockchainReviewStatus.PUBLIC:
                return role == UserRole.MODERATOR ? censorComponent() : null;
            case BlockchainReviewStatus.CENSORSHIP_CHALLENGED:
                return jurors.includes(review.ownerWallet) ? voteComponent() : onDisputeComponent();
            case BlockchainReviewStatus.CENSORED:
                return review.ownerWallet == connectedAddress ? disputeComponent() : null;
            case BlockchainReviewStatus.CHALLENGER_WON:
                return censorshipRemovalComponent();
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
