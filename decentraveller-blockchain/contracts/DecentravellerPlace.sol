// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Decentraveller.sol";
import "./DecentravellerPlaceCategory.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DecentravellerPlace is Initializable {
    uint256 public placeId;
    string public name;
    string public latitude;
    string public longitude;
    string public physicalAddress;
    DecentravellerPlaceCategory public category;
    address public placeCreator;
    string[] public reviews;

    function initialize(
        uint256 _placeId,
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerPlaceCategory _category,
        address _placeCreator
    ) public initializer {
        placeId = _placeId;
        name = _name;
        latitude = _latitude;
        longitude = _longitude;
        physicalAddress = _physicalAddress;
        category = _category;
        placeCreator = _placeCreator;
    }

    function addReview(string memory _review) public {
        reviews.push(_review);
    }

    function getReviews() external view returns (string[] memory) {
        return reviews;
    }
}
