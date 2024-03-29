// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Decentraveller.sol";
import "./DecentravellerDataTypes.sol";
import "./DecentravellerReviewCloneFactory.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Review__NonExistent(uint256 reviewId);
error Review__InvalidScore(uint8 score);

contract DecentravellerPlace is Initializable, Ownable {
    uint256 private placeId;
    string private name;
    string private latitude;
    string private longitude;
    string private physicalAddress;
    DecentravellerDataTypes.DecentravellerPlaceCategory public category;
    address private placeCreator;
    mapping(uint256 => address) reviewAddressByReviewId;

    DecentravellerReviewCloneFactory private reviewFactory;
    uint256 private currentReviewId = 0;

    function initialize(
        uint256 _placeId,
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerDataTypes.DecentravellerPlaceCategory _category,
        address _placeCreator,
        address _reviewFactory,
        address _owner
    ) public initializer {
        placeId = _placeId;
        name = _name;
        latitude = _latitude;
        longitude = _longitude;
        physicalAddress = _physicalAddress;
        category = _category;
        placeCreator = _placeCreator;
        reviewFactory = DecentravellerReviewCloneFactory(_reviewFactory);
        _transferOwnership(_owner);
    }

    function addReview(
        string memory _reviewText,
        string[] memory _imagesHashes,
        uint8 _score,
        address _reviewCreator
    ) external onlyOwner {
        if (_score > 5) {
            revert Review__InvalidScore(_score);
        }
        currentReviewId++;
        address reviewAddress = reviewFactory.createNewReview(
            currentReviewId,
            placeId,
            _reviewCreator,
            _reviewText,
            _imagesHashes,
            _score
        );
        reviewAddressByReviewId[currentReviewId] = reviewAddress;
    }

    function getReviewAddress(
        uint256 _reviewId
    ) external view returns (address) {
        if (reviewAddressByReviewId[_reviewId] == address(0)) {
            revert Review__NonExistent(_reviewId);
        }

        return reviewAddressByReviewId[_reviewId];
    }

    function getCurrentReviewId() external view returns (uint256) {
        return currentReviewId;
    }

    function getPlaceId() external view returns (uint256) {
        return placeId;
    }
}
