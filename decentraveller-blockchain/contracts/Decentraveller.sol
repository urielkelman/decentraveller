// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DecentravellerPlace.sol";
import "./DecentravellerDataTypes.sol";
import "./DecentravellerPlaceCloneFactory.sol";
import "hardhat/console.sol";

error Place__NonExistent(uint256 placeId);
error Profile__NicknameInUse(string nickname);
error Address__Unregistered(address sender);

contract Decentraveller {
    event ProfileUpdate(
        address owner,
        string nickname,
        string name,
        string country,
        DecentravellerDataTypes.DecentravellerGender gender,
        DecentravellerDataTypes.DecentravellerInterest interest
    );

    uint256 private currentPlaceId;
    DecentravellerPlaceCloneFactory placeFactory;
    mapping(address => DecentravellerDataTypes.DecentravellerProfile) profilesByowner;
    mapping(string => address) ownersByNicknames;

    function registerProfile(
        string memory _nickname,
        string memory _name,
        string memory _country,
        DecentravellerDataTypes.DecentravellerGender _gender,
        DecentravellerDataTypes.DecentravellerInterest _interest
    ) public returns (address owner) {
        if(ownersByNicknames[_nickname] != address(0) && ownersByNicknames[_nickname] != msg.sender){
            revert Profile__NicknameInUse(_nickname);
        }
        if(profilesByowner[msg.sender].owner != address(0)){
            // Nickname change
            delete ownersByNicknames[profilesByowner[msg.sender].nickname];
        }
        ownersByNicknames[_nickname] = msg.sender;
        profilesByowner[msg.sender].owner = msg.sender;
        profilesByowner[msg.sender].nickname = _nickname;
        profilesByowner[msg.sender].name = _name;
        profilesByowner[msg.sender].country = _country;
        profilesByowner[msg.sender].gender = _gender;
        profilesByowner[msg.sender].interest = _interest;

        emit ProfileUpdate(
            msg.sender,
            _nickname,
            _name,
            _country,
            _gender,
            _interest
        );

        return msg.sender;
    }

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
        DecentravellerDataTypes.DecentravellerPlaceCategory category
    ) public returns (uint256 placeId) {
        if(profilesByowner[msg.sender].owner == address(0)) revert Address__Unregistered(msg.sender);
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
