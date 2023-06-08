// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./DecentravellerPlace.sol";
import "./DecentravellerDataTypes.sol";
import "./DecentravellerPlaceCloneFactory.sol";
import "hardhat/console.sol";

error Place__NonExistent(uint256 placeId);
error Place__AlreadyExistent(uint256 placeId);
error Profile__NicknameInUse(string nickname);
error Address__Unregistered(address sender);

contract Decentraveller {
    event UpdatedProfile(
        address owner,
        string nickname,
        string country,
        DecentravellerDataTypes.DecentravellerPlaceCategory interest
    );

    uint256 private currentPlaceId;
    DecentravellerPlaceCloneFactory placeFactory;
    mapping(uint256 => address) private placeAddressByPlaceId;
    mapping(string => uint) private placeIdByPlaceLocation;
    mapping(address => DecentravellerDataTypes.DecentravellerProfile) profilesByOwner;
    mapping(string => address) ownersByNicknames;

    function registerProfile(
        string calldata _nickname,
        string calldata _country,
        DecentravellerDataTypes.DecentravellerPlaceCategory _interest
    ) public returns (address owner) {
        address nicknameOwner = ownersByNicknames[_nickname];
        if (nicknameOwner != address(0) && nicknameOwner != msg.sender) {
            revert Profile__NicknameInUse(_nickname);
        }

        if (profilesByOwner[msg.sender].owner != address(0)) {
            // Nickname change
            delete ownersByNicknames[profilesByOwner[msg.sender].nickname];
        }

        ownersByNicknames[_nickname] = msg.sender;
        profilesByOwner[msg.sender].owner = msg.sender;
        profilesByOwner[msg.sender].nickname = _nickname;
        profilesByOwner[msg.sender].country = _country;
        profilesByOwner[msg.sender].interest = _interest;

        emit UpdatedProfile(msg.sender, _nickname, _country, _interest);

        return msg.sender;
    }

    constructor(address _placesFactory) {
        placeFactory = DecentravellerPlaceCloneFactory(_placesFactory);
        currentPlaceId = 0;
    }

    function addPlace(
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerDataTypes.DecentravellerPlaceCategory category
    ) public returns (uint256 placeId) {
        if (profilesByOwner[msg.sender].owner == address(0)) {
            revert Address__Unregistered(msg.sender);
        }

        string memory locationIdentifier = string.concat(_latitude, _longitude);
        uint256 placeIdForLocation = placeIdByPlaceLocation[locationIdentifier];
        /* placeForLocation being zero means that there is not another place with the specified location */
        if (placeIdForLocation != 0) {
            revert Place__AlreadyExistent(placeIdForLocation);
        }

        currentPlaceId += 1;
        placeIdByPlaceLocation[locationIdentifier] = currentPlaceId;
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
