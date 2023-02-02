// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DecentravellerPlace.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract DecentravellerPlaceCloneFactory {
    address immutable decentravellerPlaceImplementation;

    event NewPlace(
        address indexed placeCreator,
        uint256 indexed id,
        string placeName,
        string tourismField,
        string latitude,
        string longitude
    );

    constructor(address _decentravellerPlaceImplementation) {
        decentravellerPlaceImplementation = _decentravellerPlaceImplementation;
    }

    function createNewPlace(
        uint256 _placeId,
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _touristField,
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
            _touristField,
            _placeCreator
        );
        emit NewPlace(
            _placeCreator,
            _placeId,
            _name,
            _touristField,
            _latitude,
            _longitude
        );
        return placeCloneAddress;
    }
}
