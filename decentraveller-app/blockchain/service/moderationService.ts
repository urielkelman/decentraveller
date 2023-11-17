import { blockchainAdapter, BlockchainAdapter } from '../blockhainAdapter';
import { apiAdapter, ApiAdapter } from '../../api/apiAdapter';
import { ethers } from 'ethers';
import { BlockchainCensorshipVotes, BlockchainReviewStatus } from '../types';
import { decentravellerReviewContract } from '../contracts/decentravellerReviewContract';
class ModerationService {
    private blockchainAdapter: BlockchainAdapter;
    constructor(blockchainAdapter: BlockchainAdapter, apiAdapter: ApiAdapter) {
        this.blockchainAdapter = blockchainAdapter;
    }

    /**
     * Creates a transaction that censors the specified review. This method should be only called if the invoking user
     * has the moderator role, otherwise the transaction will fail. Also, it should be an UNCENSORED review.
     * @param web3Provider
     * @param placeId
     * @param reviewId
     * @param ruleId
     */
    async censorReview(web3Provider: ethers.providers.Web3Provider, placeId: number, reviewId: number, ruleId: number) {
        return this.blockchainAdapter.censorReview(web3Provider, placeId, reviewId, ruleId);
    }

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
    ): Promise<any> {
        return this.blockchainAdapter.challengeReviewCensorship(web3Provider, placeId, reviewId);
    }

    /**
     * Returns the status of the review, that can be one of the following options:
     * PUBLIC, CENSORED, ON_DISPUTE, CHALLENGER_WON, MODERATOR_WON, UNCENSORED_BY_DISPUTE
     * @param web3Provider
     * @param placeId
     * @param reviewId
     */
    async getReviewCensorStatus(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        reviewId: number,
    ): Promise<BlockchainReviewStatus> {
        const reviewContract = await this.getReviewContract(web3Provider, placeId, reviewId);
        return await reviewContract.getState();
    }

    private async getReviewContractAddress(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        reviewId: number,
    ): Promise<string> {
        return await this.blockchainAdapter.getReviewAddress(web3Provider, placeId, reviewId);
    }

    /**
     * Returns the address of the review
     * @param web3Provider
     * @param placeId
     * @param reviewId
     */
    private async getReviewContract(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        reviewId: number,
    ): Promise<ethers.Contract> {
        try {
            const address = await this.getReviewContractAddress(web3Provider, placeId, reviewId);
            return new ethers.Contract(address, decentravellerReviewContract.fullContractABI, web3Provider);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * For a review that was censored and then disputed, returns the amount of votes supporting the challenger and against the challenger.
     * @param web3Provider
     * @param placeId
     * @param reviewId
     */
    async getChallengeVotingResults(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        reviewId: number,
    ): Promise<BlockchainCensorshipVotes> {
        const reviewContract = await this.getReviewContract(web3Provider, placeId, reviewId);
        const result = await reviewContract.getChallengeVotingResults();
        return {
            ForCensorship: Number(result[0]),
            AgainstCensorship: Number(result[1]),
        };
    }

    async voteForCensorship(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        reviewId: number,
    ): Promise<string> {
        const contractAddress = await this.getReviewContractAddress(web3Provider, placeId, reviewId);
        return await this.populateAndSend(web3Provider, contractAddress, 'voteForCensorship');
    }

    async voteAgainstCensorship(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        reviewId: number,
    ): Promise<any> {
        const contractAddress = await this.getReviewContractAddress(web3Provider, placeId, reviewId);
        return await this.populateAndSend(web3Provider, contractAddress, 'voteAgainstCensorship');
    }

    async getJuries(web3Provider: ethers.providers.Web3Provider, placeId: number, reviewId: number): Promise<string[]> {
        const reviewContract = await this.getReviewContract(web3Provider, placeId, reviewId);
        return await reviewContract.getJuries();
    }

    async executeCensorshipRemoval(web3Provider: ethers.providers.Web3Provider, placeId: number, reviewId: number): Promise<string> {
        const contractAddress = await this.getReviewContractAddress(web3Provider, placeId, reviewId);
        return await this.populateAndSend(web3Provider, contractAddress, 'executeUncensorship');
    }

    private async populateAndSend(
        web3Provider: ethers.providers.Web3Provider,
        contractAddress: string,
        functionName: string,
        ...args: unknown[]
    ): Promise<string> {
        return this.blockchainAdapter.populateAndSendWithAddress(
            web3Provider,
            decentravellerReviewContract,
            functionName,
            contractAddress,
            ...args,
        );
    }

    /**
     * For a review that has been censored and disputed, returns a boolean indicating if the user has voted in the dispute.
     * The user has to been selected for voting, otherwise the call will be reverted.
     * @param web3Provider
     * @param placeId
     * @param reviewId
     */
    async hasVotedOnDispute(
        web3Provider: ethers.providers.Web3Provider,
        placeId: number,
        reviewId: number,
    ): Promise<boolean> {
        const reviewContract = await this.getReviewContract(web3Provider, placeId, reviewId);
        return await reviewContract.hasVoted();
    }
}

const moderationService = new ModerationService(blockchainAdapter, apiAdapter);

export { moderationService };
