// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Decentraveller {
    enum TourismField {
        GASTRONOMY,
        ENTERTAINMENT,
        HISTORICAL
    }

    struct Place {
        TourismField TourismField;
        string latitude;
        string longitude;
        string[] reviews;
    }

    mapping(string => Place) places;

    function addPlace(
        string memory _name,
        TourismField _tourismField,
        string memory _latitude,
        string memory _longitude
    ) public {
        places[_name] = Place(
            _tourismField,
            _latitude,
            _longitude,
            new string[](0)
        );
    }
}
