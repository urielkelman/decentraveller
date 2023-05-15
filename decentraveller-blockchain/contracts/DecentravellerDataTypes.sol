// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library DecentravellerDataTypes {
    enum DecentravellerPlaceCategory {
        GASTRONOMY,
        ACCOMODATION,
        ENTERTAINMENT
    }

    enum DecentravellerInterest {
        GASTRONOMY,
        ACCOMMODATION,
        ENTERTAINMENT
    }

    struct DecentravellerProfile {
        address owner;
        string nickname;
        string name;
        string country;
        DecentravellerInterest interest;
    }
}
