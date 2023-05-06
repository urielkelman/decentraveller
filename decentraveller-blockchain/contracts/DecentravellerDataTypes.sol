// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library DecentravellerDataTypes {
    enum DecentravellerPlaceCategory {
        GASTRONOMY,
        ACCOMODATION,
        ENTERTAINMENT
    }

    enum DecentravellerGender {
        MALE,
        FEMALE,
        OTHER
    }

    enum DecentravellerInterest {
        GASTRONOMY,
        OTHER
    }

    struct DecentravellerProfile {
        address owner;
        string username;
        string name;
        string country;
        DecentravellerGender gender;
        DecentravellerInterest interest;
    }
}
