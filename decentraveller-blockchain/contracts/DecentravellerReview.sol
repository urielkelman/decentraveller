// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DecentravellerDataTypes.sol";
import "./DecentravellerToken.sol";
import "./DecentravellerUtils.sol";
import "hardhat/console.sol";

error Review__BadStateForOperation(
    DecentravellerDataTypes.DecentravellerReviewState currentState
);
error OnlyReviewOwner__Execution();
error OnlyJury__Execution();
error Jury__AlreadyVoted();

contract DecentravellerReview is Initializable, Ownable {
    uint256 public constant CHALLENGE_PERIOD = 1 days;
    uint8 constant JURIES_AMOUNT = 5;

    mapping(address => bool) _hasVoted;

    uint256 private reviewId;
    uint256 private placeId;
    address private reviewOwner;
    string private reviewText;
    string[] private imagesHashes;
    uint8 private score;

    DecentravellerDataTypes.DecentravellerReviewState private state;
    DecentravellerDataTypes.CensorshipChallenge challenge;

    function initialize(
        uint256 _reviewId,
        uint256 _placeId,
        address _reviewOwner,
        string memory _reviewText,
        string[] memory _imagesHashes,
        uint8 _score,
        address _contractOwner
    ) public initializer {
        reviewId = _reviewId;
        placeId = _placeId;
        reviewOwner = _reviewOwner;
        reviewText = _reviewText;
        imagesHashes = _imagesHashes;
        score = _score;
        state = DecentravellerDataTypes.DecentravellerReviewState.PUBLIC;
        _transferOwnership(_contractOwner);
    }

    function censor() external onlyOwner {
        _checkReviewOperationState(
            DecentravellerDataTypes.DecentravellerReviewState.PUBLIC
        );
        state = DecentravellerDataTypes.DecentravellerReviewState.CENSORED;
    }

    function challengeCensorship(
        address _challenger,
        address _decentravellerToken
    )
        external
        onlyOwner
        returns (DecentravellerDataTypes.CensorshipChallenge memory)
    {
        if (reviewOwner != _challenger) {
            revert OnlyReviewOwner__Execution();
        }

        _checkReviewOperationState(
            DecentravellerDataTypes.DecentravellerReviewState.CENSORED
        );

        address[] memory challengeJuries = DecentravellerToken(
            _decentravellerToken
        ).getRandomHolders(JURIES_AMOUNT);

        challenge.challengeDeadline = block.timestamp + CHALLENGE_PERIOD;
        challenge.executedUncensor = false;
        challenge.forCensorshipVotes = 0;
        challenge.againstCensorshipVotes = 0;
        challenge.juries = challengeJuries;

        state = DecentravellerDataTypes
            .DecentravellerReviewState
            .CENSORSHIP_CHALLENGED;

        return challenge;
    }

    function voteForCensorship() external {
        _checkVotingIsValidAndRegisterVote(msg.sender);
        challenge.forCensorshipVotes++;
    }

    function voteAgainstCensorship() external {
        _checkVotingIsValidAndRegisterVote(msg.sender);
        challenge.againstCensorshipVotes++;
    }

    function hasVoted() external view returns (bool) {
        return _hasVoted[msg.sender];
    }

    function executeUncensorship() external onlyOwner {
        _checkReviewOperationState(
            DecentravellerDataTypes.DecentravellerReviewState.CHALLENGE_WON
        );

        state = DecentravellerDataTypes
            .DecentravellerReviewState
            .UNCENSORED_BY_CHALLENGE;
    }

    function getChallengeVotingResults() external view returns (uint8, uint8) {
        return (challenge.forCensorshipVotes, challenge.againstCensorshipVotes);
    }

    function _checkReviewOperationState(
        DecentravellerDataTypes.DecentravellerReviewState expectedState
    ) internal view {
        DecentravellerDataTypes.DecentravellerReviewState currentState = getState();

        if (currentState != expectedState) {
            revert Review__BadStateForOperation(currentState);
        }
    }

    function getState()
        public
        view
        returns (DecentravellerDataTypes.DecentravellerReviewState)
    {
        if (
            state == DecentravellerDataTypes.DecentravellerReviewState.PUBLIC ||
            state ==
            DecentravellerDataTypes.DecentravellerReviewState.CENSORED ||
            state ==
            DecentravellerDataTypes
                .DecentravellerReviewState
                .UNCENSORED_BY_CHALLENGE
        ) {
            return state;
        }

        bool deadlineReached = block.timestamp > challenge.challengeDeadline;

        if (deadlineReached) {
            bool quorumReached = _quorumReached();
            if (quorumReached) {
                if (
                    challenge.againstCensorshipVotes >
                    challenge.forCensorshipVotes
                ) {
                    return
                        DecentravellerDataTypes
                            .DecentravellerReviewState
                            .CHALLENGE_WON;
                }
            }
            return
                DecentravellerDataTypes.DecentravellerReviewState.MODERATOR_WON;
        }

        if (_isAbsoluteMajority(challenge.forCensorshipVotes)) {
            return
                DecentravellerDataTypes.DecentravellerReviewState.MODERATOR_WON;
        }

        if (_isAbsoluteMajority(challenge.againstCensorshipVotes)) {
            return
                DecentravellerDataTypes.DecentravellerReviewState.CHALLENGE_WON;
        }

        return
            DecentravellerDataTypes
                .DecentravellerReviewState
                .CENSORSHIP_CHALLENGED;
    }

    function getJuries() external view returns (address[] memory) {
        return challenge.juries;
    }

    function getOwner() external view returns (address) {
        return reviewOwner;
    }

    function _checkVotingIsValidAndRegisterVote(address _voter) internal {
        _checkReviewOperationState(
            DecentravellerDataTypes
                .DecentravellerReviewState
                .CENSORSHIP_CHALLENGED
        );

        if (
            !DecentravellerUtils.isAddressSelected(
                challenge.juries,
                _voter,
                JURIES_AMOUNT
            )
        ) {
            revert OnlyJury__Execution();
        }

        if (_hasVoted[_voter]) {
            revert Jury__AlreadyVoted();
        }

        _hasVoted[_voter] = true;
    }

    function _isAbsoluteMajority(uint8 _votes) internal pure returns (bool) {
        return _votes >= (JURIES_AMOUNT + 1) / 2;
    }

    function _quorumReached() internal view returns (bool) {
        return
            challenge.forCensorshipVotes + challenge.againstCensorshipVotes >=
            (JURIES_AMOUNT + 1) / 2;
    }
}
