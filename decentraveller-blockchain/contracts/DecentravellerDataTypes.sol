// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library DecentravellerDataTypes {
    enum DecentravellerPlaceCategory {
        GASTRONOMY,
        ACCOMODATION,
        ENTERTAINMENT,
        OTHER
    }

    enum DecentravellerRuleStatus {
        PENDING_APPROVAL,
        APPROVED,
        PENDING_DELETED,
        DELETED
    }

    enum DecentravellerUserRole {
        NORMAL,
        ADMIN
    }

    enum DecentravellerReviewState {
        PUBLIC,
        CENSORED
    }

    struct DecentravellerProfile {
        address owner;
        string nickname;
        string country;
        DecentravellerPlaceCategory interest;
        DecentravellerUserRole role;
    }

    struct DecentravellerRule {
        uint256 proposalId;
        DecentravellerDataTypes.DecentravellerRuleStatus status;
        address proposer;
        uint256 deleteProposalId;
        address deletionProposer;
        string statement;
    }
}
