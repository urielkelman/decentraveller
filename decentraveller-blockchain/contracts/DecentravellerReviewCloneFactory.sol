// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./DecentravellerReview.sol";

contract DecentravellerReviewCloneFactory {
    address immutable decentravellerReviewImplementation;

    event NewReview(
        uint256 indexed reviewId,
        uint256 indexed placeId,
        address _owner,
        string _reviewText,
        string[] _imagesHashes,
        uint8 _score
    );

    constructor(address _decentravellerReviewImplementation) {
        decentravellerReviewImplementation = _decentravellerReviewImplementation;
    }

    function createNewReview(
        uint256 _reviewId,
        uint256 _placeId,
        address _owner,
        string memory _reviewText,
        string[] memory _imagesHashes,
        uint8 _score
    ) external returns (address) {
        address reviewCloneAddress = Clones.clone(
            decentravellerReviewImplementation
        );

        DecentravellerReview(reviewCloneAddress).initialize(
            _reviewId,
            _placeId,
            _owner,
            _reviewText,
            _imagesHashes,
            _score
        );

        return reviewCloneAddress;
    }
}
