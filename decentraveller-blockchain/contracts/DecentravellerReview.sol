// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DecentravellerReview is Initializable {
    uint256 reviewId;
    uint256 placeId;
    address owner;
    string reviewText;
    string[] imagesHashes;
    uint8 score;

    function initialize(
        uint256 _reviewId,
        uint256 _placeId,
        address _owner,
        string memory _reviewText,
        string[] memory _imagesHashes,
        uint8 _score
    ) public initializer {
        reviewId = _reviewId;
        placeId = _placeId;
        owner = _owner;
        reviewText = _reviewText;
        imagesHashes = _imagesHashes;
        score = _score;
    }
}
