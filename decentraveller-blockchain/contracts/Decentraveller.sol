// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DecentravellerPlace.sol";
import "./DecentravellerPlaceCategory.sol";
import "./DecentravellerPlaceCloneFactory.sol";
import "hardhat/console.sol";

error Place__NonExistent(uint256 placeId);

contract Decentraveller {
    uint256 private currentPlaceId;
    DecentravellerPlaceCloneFactory placeFactory;

    constructor(address _placesFactory) {
        placeFactory = DecentravellerPlaceCloneFactory(_placesFactory);
        currentPlaceId = 0;
    }

    mapping(uint256 => address) private placeAddressByPlaceId;

    function addPlace(
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerPlaceCategory category
    ) public returns (uint256 placeId) {
        currentPlaceId += 1;

        placeAddressByPlaceId[currentPlaceId] = placeFactory.createNewPlace(
            currentPlaceId,
            _name,
            _latitude,
            _longitude,
            _physicalAddress,
            category,
            msg.sender
        );

        return currentPlaceId;
    }

    function getPlaceAddress(uint256 placeId) external view returns (address) {
        address placeAddress = placeAddressByPlaceId[placeId];
        if (placeAddress == address(0)) {
            revert Place__NonExistent(placeId);
        }
        return placeAddress;
    }

    function getCurrentPlaceId() external view returns (uint256) {
        return currentPlaceId;
    }
}
