// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DecentravellerDataTypes.sol";
import "hardhat/console.sol";

error Review__AlreadyCensored();
error Review__IsPublic();
error Review__BadStateForOperation(
    DecentravellerDataTypes.DecentravellerReviewState currentState
);
error OnlyReviewOwner__Execution();

contract DecentravellerReview is Initializable, Ownable {
    uint256 constant CHALLENGE_PERIOD = 1 days;

    struct CensorhipChallenge {
        uint256 challengeDeadline;
        bool executedUncensor;
        address[] juries;
    }

    uint256 private reviewId;
    uint256 private placeId;
    address private reviewOwner;
    string private reviewText;
    string[] private imagesHashes;
    uint8 private score;
    DecentravellerDataTypes.DecentravellerReviewState private state;

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
        if (state != DecentravellerDataTypes.DecentravellerReviewState.PUBLIC) {
            revert Review__AlreadyCensored();
        }
        state = DecentravellerDataTypes.DecentravellerReviewState.CENSORED;
    }

    function uncensor() external onlyOwner {
        if (
            state != DecentravellerDataTypes.DecentravellerReviewState.CENSORED
        ) {
            revert Review__IsPublic();
        }
        state = DecentravellerDataTypes.DecentravellerReviewState.PUBLIC;
    }

    function challengeCensorship(
        address _challenger,
        address _decentravellerToken
    ) external onlyOwner {
        if (reviewOwner != _challenger) {
            revert OnlyReviewOwner__Execution();
        }

        DecentravellerDataTypes.DecentravellerReviewState currentState = getState();

        if (
            currentState !=
            DecentravellerDataTypes.DecentravellerReviewState.CENSORED
        ) {
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
