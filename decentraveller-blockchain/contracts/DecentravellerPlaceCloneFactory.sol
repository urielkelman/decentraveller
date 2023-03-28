// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DecentravellerPlace.sol";
import "./DecentravellerPlaceCategory.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract DecentravellerPlaceCloneFactory {
    address immutable decentravellerPlaceImplementation;
    address immutable decentravellerReviewCloneFactory;

    event NewPlace(
        uint256 indexed id,
        address indexed placeCreator,
        string placeName,
        string physicalAddress,
        DecentravellerPlaceCategory category,
        string latitude,
        string longitude
    );

    constructor(
        address _decentravellerPlaceImplementation,
        address _decentravellerReviewCloneFactory
    ) {
        decentravellerPlaceImplementation = _decentravellerPlaceImplementation;
        decentravellerReviewCloneFactory = _decentravellerReviewCloneFactory;
    }

    function createNewPlace(
        uint256 _placeId,
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerPlaceCategory _category,
        address _placeCreator
    ) external returns (address) {
        address placeCloneAddress = Clones.clone(
            decentravellerPlaceImplementation
        );
        DecentravellerPlace(placeCloneAddress).initialize(
            _placeId,
            _name,
            _latitude,
            _longitude,
            _physicalAddress,
            _category,
            _placeCreator,
            decentravellerReviewCloneFactory
        );

        emit NewPlace(
            _placeId,
            _placeCreator,
            _name,
            _physicalAddress,
            _category,
            _latitude,
            _longitude
        );
        return placeCloneAddress;
    }
}
