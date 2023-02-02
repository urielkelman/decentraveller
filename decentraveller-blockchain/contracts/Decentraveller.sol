// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./DecentravellerPlace.sol";
import "./DecentravellerPlaceCloneFactory.sol";

contract Decentraveller {
    uint256 public lastPlaceId;
    DecentravellerPlaceCloneFactory placeFactory;

    constructor(address _placesFactory) {
        placeFactory = DecentravellerPlaceCloneFactory(_placesFactory);
        lastPlaceId = 0;
    }

    mapping(uint256 => address) public placesAddressByPlaceId;

    function addPlace(
        string memory _name,
        string memory _tourismField,
        string memory _latitude,
        string memory _longitude
    ) public {
        lastPlaceId += 1;
        placesAddressByPlaceId[lastPlaceId] = placeFactory.createNewPlace(
            lastPlaceId,
            _name,
            _latitude,
            _longitude,
            _tourismField,
            msg.sender
        );
    }

    function addReview(uint256 _placeId, string memory _review) public {
        require(
            placesAddressByPlaceId[_placeId] != address(0),
            "Review must be added to an existent place"
        );
        DecentravellerPlace(placesAddressByPlaceId[_placeId]).addReview(
            _review
        );
    }

    function getReviews(
        uint256 _placeId
    ) external view returns (string[] memory) {
        require(
            placesAddressByPlaceId[_placeId] != address(0),
            "Place does not exist"
        );
        return
            DecentravellerPlace(placesAddressByPlaceId[_placeId]).getReviews();
    }
}
