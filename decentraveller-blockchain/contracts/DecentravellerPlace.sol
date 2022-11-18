// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Decentraveller.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DecentravellerPlace is Initializable {
    uint256 public placeId;
    string public name;
    string public latitude;
    string public longitude;
    string public tourismField;
    address public placeCreator;
    string[] public reviews;

    event NewPlace(
        address _placeCreator,
        uint256 _id,
        string _placeName,
        string _tourismField,
        string _latitude,
        string _longitude
    );

    function initialize(
        uint256 _placeId,
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _tourismField,
        address _placeCreator
    ) public initializer {
        placeId = _placeId;
        name = _name;
        latitude = _latitude;
        longitude = _longitude;
        tourismField = _tourismField;
        placeCreator = _placeCreator;

        emit NewPlace(
            _placeCreator,
            _placeId,
            _name,
            _tourismField,
            _latitude,
            _longitude
        );
    }

    function addReview(string memory _review) public {
        reviews.push(_review);
    }

    function getReviews() external view returns (string[] memory) {
        return reviews;
    }
}
