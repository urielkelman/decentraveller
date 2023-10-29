// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./DecentravellerPlace.sol";
import "./DecentravellerDataTypes.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DecentravellerPlaceCloneFactory is Ownable {
    address immutable decentravellerPlaceImplementation;
    address immutable decentravellerReviewCloneFactory;
    DecentravellerToken decentravellerToken;

    event NewPlace(
        uint256 indexed id,
        address indexed placeCreator,
        string placeName,
        string physicalAddress,
        DecentravellerDataTypes.DecentravellerPlaceCategory category,
        string latitude,
        string longitude
    );

    constructor(
        address _decentravellerPlaceImplementation,
        address _decentravellerReviewCloneFactory,
        address _token
    ) {
        decentravellerPlaceImplementation = _decentravellerPlaceImplementation;
        decentravellerReviewCloneFactory = _decentravellerReviewCloneFactory;
        decentravellerToken = DecentravellerToken(_token);
    }

    function createNewPlace(
        uint256 _placeId,
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerDataTypes.DecentravellerPlaceCategory _category,
        address _placeCreator
    ) external onlyOwner returns (address) {
        address placeCloneAddress = Clones.clone(
            decentravellerPlaceImplementation
        );
        DecentravellerPlace decentravellerPlace = DecentravellerPlace(
            placeCloneAddress
        );
        decentravellerPlace.initialize(
            _placeId,
            _name,
            _latitude,
            _longitude,
            _physicalAddress,
            _category,
            _placeCreator,
            decentravellerReviewCloneFactory,
            owner()
        );
        decentravellerToken.rewardNewPlace(_placeCreator);

        emit NewPlace(
            _placeId,
            _placeCreator,
            _name,
            _physicalAddress,
            _category,
            _latitude,
            _longitude
        );

        DecentravellerReviewCloneFactory(decentravellerReviewCloneFactory)
            .registerPlaceAddress(placeCloneAddress);

        return placeCloneAddress;
    }
}
