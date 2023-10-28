// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DecentravellerDataTypes.sol";

error Review__AlreadyCensored();
error Review__IsPublic();

contract DecentravellerReview is Initializable, Ownable {
    uint256 reviewId;
    uint256 placeId;
    address reviewOwner;
    string reviewText;
    string[] imagesHashes;
    uint8 score;
    DecentravellerDataTypes.DecentravellerReviewState state;

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

    function getState()
        public
        view
        returns (DecentravellerDataTypes.DecentravellerReviewState)
    {
        return state;
    }
}
