// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library DecentravellerDataTypes {
    enum DecentravellerPlaceCategory {
        GASTRONOMY,
        ACCOMODATION,
        ENTERTAINMENT,
        OTHER
    }

    struct DecentravellerProfile {
        address owner;
        string nickname;
        string name;
        string country;
        DecentravellerPlaceCategory interest;
    }
}
