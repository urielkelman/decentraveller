import { blockchainAdapter, BlockchainAdapter } from '../blockhainAdapter';
import { apiAdapter, ApiAdapter } from '../../api/apiAdapter';
import { ethers } from 'ethers';
import {BlockchainReviewStatus} from "../types";

class ModerationService {
    private blockchainAdapter: BlockchainAdapter;
    private apiAdapter: ApiAdapter;
    constructor(blockchainAdapter: BlockchainAdapter, apiAdapter: ApiAdapter) {
        this.blockchainAdapter = blockchainAdapter;
        this.apiAdapter = apiAdapter;
    }

    /**
     * Returns all the disputes in which the user is involved, both the created by the user and the ones
     * where the user was selected to participate voting.
     * @param web3Provider
     * */
    async getMyDisputes(web3Provider: ethers.providers.Web3Provider): Promise<any> {}

    /**
     * Creates a transaction that censors the specified review. This method should be only called if the invoking user
     * has the moderator role, otherwise the transaction will fail. Also, it should be an UNCENSORED review.
     * @param web3Provider
     * @param placeId
     * @param reviewId
     */
    async censorReview(web3Provider: ethers.providers.Web3Provider, placeId: number, reviewId: number): Promise<any> {}

    /**
     * Creates a transaction creating a dispute on a censored transaction so other users can participate in moderation.
     * It should be call only by the creator of the review, otherwise the transaction should be reverted.
     * @param web3Provider
     * @param placeId
     * @param reviewId
     */
    async disputeReviewCensorship(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        reviewId: number,
    ): Promise<any> {}

    /**
     * Returns the status of the review, that can be one of the following options:
         * PUBLIC, CENSORED, ON_DISPUTE, CHALLENGER_WON, MODERATOR_WON, UNCENSORED_BY_DISPUTE
     * @param web3Provider
     * @param reviewAddress
     */
    async getReviewCensorStatus(web3Provider: ethers.providers.Web3Provider, reviewAddress: string): Promise<any> {}

    /**
     * Returns the address of the review
     * @param web3Provider
     * @param placeId
     * @param reviewId
     */
    async getReviewAddress(web3Provider: ethers.providers.Web3Provider, placeId: number, reviewId: number): Promise<string> {}

    /**
     * For a review that was censored and then disputed, returns the amount of votes supporting the challenger and against the challenger.
     * @param web3Provider
     * @param reviewAddress
     */
    async getReviewDisputeVoteCount(web3Provider: ethers.providers.Web3Provider, reviewAddress: string): Promise<any> {}

    /**
     * For a review that has been censored and disputed, returns a boolean indicating if the user has voted in the dispute.
     * The user has to been selected for voting, otherwise the call will be reverted.
     * @param web3Provider
     * @param reviewAddress
     * @param userAddress
     */
    async hasVotedOnDispute(
        web3Provider: ethers.providers.Web3Provider,
        reviewAddress: string,
        userAddress: string,
    ): Promise<any> {}
}

const moderationService = new ModerationService(blockchainAdapter, apiAdapter);

export { moderationService };
