// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./DecentravellerPlace.sol";
import "./DecentravellerPlaceCategory.sol";
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
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerPlaceCategory category
    ) public {
        lastPlaceId += 1;
        placesAddressByPlaceId[lastPlaceId] = placeFactory.createNewPlace(
            lastPlaceId,
            _name,
            _latitude,
            _longitude,
            _physicalAddress,
            category,
            msg.sender
        );
    }
}
