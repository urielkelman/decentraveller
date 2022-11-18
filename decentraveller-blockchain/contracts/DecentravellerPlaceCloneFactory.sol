// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DecentravellerPlace.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract DecentravellerPlaceCloneFactory {
    address immutable decentravellerPlaceImplementation;

    constructor(address _decentravellerPlaceImplementation) {
        decentravellerPlaceImplementation = _decentravellerPlaceImplementation;
    }

    function createNewPlace(
        uint256 _placeId,
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _tourismField,
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
            _tourismField,
            _placeCreator
        );
        return placeCloneAddress;
    }
}
