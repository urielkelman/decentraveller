// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Decentraveller.sol";
import "./DecentravellerPlaceCategory.sol";
import "./DecentravellerReviewCloneFactory.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

error Review__InvalidScore();

contract DecentravellerPlace is Initializable {
    uint256 public placeId;
    string public name;
    string public latitude;
    string public longitude;
    string public physicalAddress;
    DecentravellerPlaceCategory public category;
    address public placeCreator;
    mapping(uint256 => address) reviewsAddressByReviewId;

    DecentravellerReviewCloneFactory private reviewFactory;
    uint256 private currentReviewId = 0;

    function initialize(
        uint256 _placeId,
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerPlaceCategory _category,
        address _placeCreator,
        address _reviewFactory
    ) public initializer {
        placeId = _placeId;
        name = _name;
        latitude = _latitude;
        longitude = _longitude;
        physicalAddress = _physicalAddress;
        category = _category;
        placeCreator = _placeCreator;
        reviewFactory = DecentravellerReviewCloneFactory(_reviewFactory);
    }

    function addReview(
        string memory _reviewText,
        string[] memory _imagesHashes,
        uint8 _score
    ) public {
        if (_score > 5) {
            revert Review__InvalidScore();
        }
        address reviewAddress = reviewFactory.createNewReview(
            currentReviewId,
            placeId,
            msg.sender,
            _reviewText,
            _imagesHashes,
            _score
        );

        reviewsAddressByReviewId[currentReviewId] = reviewAddress;

        currentReviewId++;
    }

    function getReview(uint256 _reviewId) external view returns (address) {
        require(
            reviewsAddressByReviewId[_reviewId] != address(0),
            "Review does not exist"
        );

        return reviewsAddressByReviewId[_reviewId];
    }
}
