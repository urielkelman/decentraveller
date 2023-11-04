// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./DecentravellerPlace.sol";
import "./DecentravellerReview.sol";
import "./DecentravellerDataTypes.sol";
import "./DecentravellerPlaceCloneFactory.sol";
import "./DecentravellerGovernance.sol";
import "./DecentravellerToken.sol";
import "hardhat/console.sol";

error Place__NonExistent(uint256 placeId);
error Place__AlreadyExistent(uint256 placeId);
error Profile__NicknameInUse(string nickname);
error Profile__AlreadyCreated(address userAddress);
error Address__Unregistered(address sender);
error OnlyGovernance__Execution();
error Rule__NonExistent(uint256 ruleId);
error Rule__AlreadyDeleted(uint256 ruleId);
error OnlyModerator__Execution();
error OnlyNonModerator__Execution();

contract Decentraveller {
    event ProfileCreated(
        address indexed owner,
        string nickname,
        string country,
        DecentravellerDataTypes.DecentravellerPlaceCategory interest,
        DecentravellerDataTypes.DecentravellerUserRole userRole
    );

    event DecentravellerRuleProposed(
        uint256 indexed ruleId,
        address indexed proposer,
        string statement,
        uint256 proposalId,
        uint256 proposalTimestamp
    );

    event DecentravellerRuleApproved(uint256 indexed ruleId);

    event DecentravellerRuleDeletionProposed(
        uint256 indexed ruleId,
        address indexed proposer,
        uint256 proposalId,
        uint256 proposalTimestamp
    );

    event DecentravellerRuleDeleted(uint256 indexed ruleId);

    event DecentravellerReviewCensored(
        uint256 indexed placeId,
        uint256 indexed reviewId,
        uint256 brokenRuleId,
        address moderator
    );

    event DecentravellerReviewCensorshipChallenged(
        uint256 indexed placeId,
        uint256 indexed reviewId,
        uint256 challengeDeadline,
        address[] juries
    );

    event DecentravellerReviewUncensored(
        uint256 indexed placeId,
        uint256 indexed reviewId
    );

    event ProfileRoleChange(
        address indexed owner,
        DecentravellerDataTypes.DecentravellerUserRole userRole
    );

    DecentravellerToken token;
    DecentravellerGovernance governance;
    DecentravellerPlaceCloneFactory placeFactory;

    uint256 private currentPlaceId;
    uint256 private currentRuleId;

    uint8 minModeratorsAmount;
    uint8 currentModeratorsAmount;
    uint256 moderatorCost;

    address timelockGovernanceAddress;

    mapping(uint256 => address) private placeAddressByPlaceId;
    mapping(string => uint) private placeIdByPlaceLocation;
    mapping(address => DecentravellerDataTypes.DecentravellerProfile) profilesByOwner;
    mapping(string => address) ownersByNicknames;
    mapping(uint256 => DecentravellerDataTypes.DecentravellerRule) ruleById;

    constructor(
        address _governance,
        address _placesFactory,
        address _token,
        string[] memory initialRules,
        uint8 _minModeratorsAmount,
        uint256 _moderatorCost
    ) {
        token = DecentravellerToken(_token);
        governance = DecentravellerGovernance(payable(_governance));
        timelockGovernanceAddress = governance.timelock();
        placeFactory = DecentravellerPlaceCloneFactory(_placesFactory);
        uint256 initialRulesLength = initialRules.length;
        for (uint i = 1; i <= initialRulesLength; i++) {
            DecentravellerDataTypes.DecentravellerRule
                storage initialRule = ruleById[i];
            initialRule.proposer = msg.sender;
            initialRule.statement = initialRules[i - 1];
            initialRule.status = DecentravellerDataTypes
                .DecentravellerRuleStatus
                .APPROVED;
        }
        currentRuleId = initialRulesLength;
        currentPlaceId = 0;
        minModeratorsAmount = _minModeratorsAmount;
        currentModeratorsAmount = 0;
        moderatorCost = _moderatorCost;
    }

    modifier onlyGovernance() {
        if (msg.sender != timelockGovernanceAddress) {
            revert OnlyGovernance__Execution();
        }
        _;
    }

    modifier onlyRegisteredAddress() {
        if (profilesByOwner[msg.sender].owner == address(0)) {
            revert Address__Unregistered(msg.sender);
        }
        _;
    }

    modifier onlyModerator() {
        if (
            profilesByOwner[msg.sender].role !=
            DecentravellerDataTypes.DecentravellerUserRole.MODERATOR
        ) {
            revert OnlyModerator__Execution();
        }
        _;
    }

    modifier onlyNonModerator() {
        if (
            profilesByOwner[msg.sender].role ==
            DecentravellerDataTypes.DecentravellerUserRole.MODERATOR
        ) {
            revert OnlyNonModerator__Execution();
        }
        _;
    }

    function registerProfile(
        string calldata _nickname,
        string calldata _country,
        DecentravellerDataTypes.DecentravellerPlaceCategory _interest
    ) public returns (address owner) {
        address profileOwner = profilesByOwner[msg.sender].owner;

        if (profileOwner != address(0)) {
            revert Profile__AlreadyCreated(profileOwner);
        }

        address nicknameOwner = ownersByNicknames[_nickname];

        if (nicknameOwner != address(0)) {
            revert Profile__NicknameInUse(_nickname);
        }

        ownersByNicknames[_nickname] = msg.sender;

        DecentravellerDataTypes.DecentravellerUserRole role;

        if (currentModeratorsAmount < minModeratorsAmount) {
            role = DecentravellerDataTypes.DecentravellerUserRole.MODERATOR;
            currentModeratorsAmount++;
        } else {
            role = DecentravellerDataTypes.DecentravellerUserRole.NORMAL;
        }

        profilesByOwner[msg.sender] = DecentravellerDataTypes
            .DecentravellerProfile({
                owner: msg.sender,
                nickname: _nickname,
                country: _country,
                interest: _interest,
                role: role
            });

        emit ProfileCreated(msg.sender, _nickname, _country, _interest, role);

        return msg.sender;
    }

    function promoteToModerator() external onlyNonModerator {
        token.burn(msg.sender, moderatorCost);
        profilesByOwner[msg.sender].role = DecentravellerDataTypes.DecentravellerUserRole.MODERATOR;
        currentModeratorsAmount++;
        emit ProfileRoleChange(msg.sender, DecentravellerDataTypes.DecentravellerUserRole.MODERATOR);
    }

    function moderatorPromotionCost() external view returns (uint256){
        return moderatorCost;
    }

    function addPlace(
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerDataTypes.DecentravellerPlaceCategory category
    ) external onlyRegisteredAddress returns (uint256 placeId) {
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

    function getPlaceAddress(uint256 placeId) public view returns (address) {
        address placeAddress = placeAddressByPlaceId[placeId];
        if (placeAddress == address(0)) {
            revert Place__NonExistent(placeId);
        }
        return placeAddress;
    }

    function addReview(
        uint256 placeId,
        string memory _reviewText,
        string[] memory _imagesHashes,
        uint8 _score
    ) external onlyRegisteredAddress {
        address placeAddress = getPlaceAddress(placeId);
        DecentravellerPlace(placeAddress).addReview(
            _reviewText,
            _imagesHashes,
            _score,
            msg.sender
        );
    }

    function getReviewAddress(
        uint256 _placeId,
        uint256 _reviewId
    ) external view returns (address) {
        address placeAddress = getPlaceAddress(_placeId);
        return DecentravellerPlace(placeAddress).getReviewAddress(_reviewId);
    }

    function _getReviewAddress(
        uint256 _placeId,
        uint256 _reviewId
    ) internal view returns (address) {
        address placeAddress = getPlaceAddress(_placeId);
        return DecentravellerPlace(placeAddress).getReviewAddress(_reviewId);
    }

    function censorReview(
        uint256 _placeId,
        uint256 _reviewId,
        uint256 _brokenRuleId
    ) external onlyModerator {
        _getRuleById(_brokenRuleId);

        address reviewAddress = _getReviewAddress(_placeId, _reviewId);

        DecentravellerReview(reviewAddress).censor();

        emit DecentravellerReviewCensored(
            _placeId,
            _reviewId,
            _brokenRuleId,
            msg.sender
        );
    }

    function challengeReviewCensorship(
        uint256 _placeId,
        uint256 _reviewId
    ) external onlyRegisteredAddress {
        address reviewAddress = _getReviewAddress(_placeId, _reviewId);
        DecentravellerReview review = DecentravellerReview(reviewAddress);
        DecentravellerDataTypes.CensorshipChallenge memory challenge = review
            .challengeCensorship(msg.sender, address(governance.token()));

        emit DecentravellerReviewCensorshipChallenged(
            _placeId,
            _reviewId,
            challenge.challengeDeadline,
            challenge.juries
        );
    }

    function executeReviewUncensorship(
        uint256 _placeId,
        uint256 _reviewId
    ) external onlyRegisteredAddress {
        address reviewAddress = _getReviewAddress(_placeId, _reviewId);
        DecentravellerReview review = DecentravellerReview(reviewAddress);
        review.executeUncensorship();
        emit DecentravellerReviewUncensored(_placeId, _reviewId);
    }

    function getCurrentRuleId() external view returns (uint256) {
        return currentRuleId;
    }

    function approveProposedRule(uint256 ruleId) external onlyGovernance {
        ruleById[ruleId].status = DecentravellerDataTypes
            .DecentravellerRuleStatus
            .APPROVED;
        emit DecentravellerRuleApproved(ruleId);
    }

    function _proposeToGovernor(
        bytes memory data,
        string memory proposalStatement
    ) internal returns (uint256) {
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        targets[0] = address(this);
        values[0] = 0;
        calldatas[0] = data;

        uint256 proposalId = governance.propose(
            targets,
            values,
            calldatas,
            proposalStatement
        );
        return proposalId;
    }

    function createNewRuleProposal(
        string memory ruleStatement
    ) external onlyRegisteredAddress returns (uint256) {
        currentRuleId += 1;
        bytes memory proposalCallData = abi.encodeWithSelector(
            this.approveProposedRule.selector,
            currentRuleId
        );
        uint256 proposalId = _proposeToGovernor(
            proposalCallData,
            ruleStatement
        );
        ruleById[currentRuleId] = DecentravellerDataTypes.DecentravellerRule({
            proposalId: proposalId,
            status: DecentravellerDataTypes
                .DecentravellerRuleStatus
                .PENDING_APPROVAL,
            proposer: msg.sender,
            deleteProposalId: 0,
            deletionProposer: address(0),
            statement: ruleStatement
        });
        emit DecentravellerRuleProposed(
            currentRuleId,
            msg.sender,
            ruleStatement,
            proposalId,
            block.timestamp
        );
        return currentRuleId;
    }

    function deleteRule(uint256 ruleId) external onlyGovernance {
        DecentravellerDataTypes.DecentravellerRule storage rule = _getRuleById(
            ruleId
        );
        rule.status = DecentravellerDataTypes.DecentravellerRuleStatus.DELETED;
        emit DecentravellerRuleDeleted(ruleId);
    }

    function createRuleDeletionProposal(
        uint256 ruleId
    ) external onlyRegisteredAddress {
        DecentravellerDataTypes.DecentravellerRule storage rule = _getRuleById(
            ruleId
        );
        bytes memory proposalCallData = abi.encodeWithSelector(
            this.deleteRule.selector,
            ruleId
        );
        uint256 deletionProposalId = _proposeToGovernor(
            proposalCallData,
            string.concat("Delete rule: ", rule.statement)
        );
        rule.deleteProposalId = deletionProposalId;
        rule.deletionProposer = msg.sender;
        rule.status = DecentravellerDataTypes
            .DecentravellerRuleStatus
            .PENDING_DELETED;
        emit DecentravellerRuleDeletionProposed(
            ruleId,
            msg.sender,
            deletionProposalId,
            block.timestamp
        );
    }

    function _getRuleById(
        uint256 ruleId
    )
        internal
        view
        returns (DecentravellerDataTypes.DecentravellerRule storage)
    {
        DecentravellerDataTypes.DecentravellerRule storage rule = ruleById[
            ruleId
        ];
        if (rule.proposer == address(0)) {
            revert Rule__NonExistent(ruleId);
        }
        if (
            rule.status ==
            DecentravellerDataTypes.DecentravellerRuleStatus.DELETED
        ) {
            revert Rule__AlreadyDeleted(0);
        }
        return rule;
    }

    function getRuleById(
        uint256 ruleId
    )
        external
        view
        returns (DecentravellerDataTypes.DecentravellerRule memory)
    {
        DecentravellerDataTypes.DecentravellerRule memory rule = ruleById[
            ruleId
        ];
        if (rule.proposer == address(0)) {
            revert Rule__NonExistent(ruleId);
        }
        return rule;
    }

    function getCurrentPlaceId() external view returns (uint256) {
        return currentPlaceId;
    }

    function getTokens(address account) external view returns (uint256) {
        return governance.currentVotes(account);
    }
}
