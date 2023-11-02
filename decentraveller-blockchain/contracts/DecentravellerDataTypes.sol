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
        MODERATOR
    }

    enum DecentravellerReviewState {
        PUBLIC,
        CENSORED,
        CENSORSHIP_CHALLENGED,
        CHALLENGE_WON,
        MODERATOR_WON,
        UNCESORED_BY_CHALLENGE
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

    struct CensorshipChallenge {
        uint256 challengeDeadline;
        bool executedUncensor;
        uint8 forVotes;
        uint8 againstVotes;
        address[] juries;
    }
}
