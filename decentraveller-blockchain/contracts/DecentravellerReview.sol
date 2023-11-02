// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DecentravellerDataTypes.sol";
import "./DecentravellerToken.sol";
import "hardhat/console.sol";

error Review__BadStateForOperation(
    DecentravellerDataTypes.DecentravellerReviewState currentState
);
error OnlyReviewOwner__Execution();

contract DecentravellerReview is Initializable, Ownable {
    uint256 constant CHALLENGE_PERIOD = 1 days;
    uint8 constant JURIES_AMOUNT = 5;

    mapping(address => bool) hasVoted;

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

    function uncensor() external onlyOwner {
        _checkReviewOperationState(
            DecentravellerDataTypes.DecentravellerReviewState.CENSORED
        );
        state = DecentravellerDataTypes.DecentravellerReviewState.PUBLIC;
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
        challenge.forVotes = 0;
        challenge.againstVotes = 0;
        challenge.juries = challengeJuries;

        state = DecentravellerDataTypes
            .DecentravellerReviewState
            .CENSORSHIP_CHALLENGED;

        return challenge;
    }

    function voteForOwner(address _voter) external onlyOwner {
        _checkReviewOperationState(
            DecentravellerDataTypes
                .DecentravellerReviewState
                .CENSORSHIP_CHALLENGED
        );
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
        return state;
    }
}
