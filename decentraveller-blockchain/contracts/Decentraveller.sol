// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./DecentravellerPlace.sol";
import "./DecentravellerDataTypes.sol";
import "./DecentravellerPlaceCloneFactory.sol";
import "./DecentravellerGovernance.sol";
import "./DecentravellerToken.sol";
import "hardhat/console.sol";

error Place__NonExistent(uint256 placeId);
error Place__AlreadyExistent(uint256 placeId);
error Profile__NicknameInUse(string nickname);
error Address__Unregistered(address sender);
error OnlyGovernance__Execution();
error Rule__NonExistent(uint256 ruleId);
error Rule__AlreadyDeleted(uint256 ruleId);

contract Decentraveller {
    event UpdatedProfile(
        address indexed owner,
        string nickname,
        string country,
        DecentravellerDataTypes.DecentravellerPlaceCategory interest
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
        uint256 proposalTimestamp
    );

    event DecentravellerRuleDeleted(uint256 indexed ruleId);

    DecentravellerGovernance governance;
    DecentravellerPlaceCloneFactory placeFactory;

    uint256 private currentPlaceId;
    uint256 private currentRuleId;

    address timelockGovernanceAddress;

    mapping(uint256 => address) private placeAddressByPlaceId;
    mapping(string => uint) private placeIdByPlaceLocation;
    mapping(address => DecentravellerDataTypes.DecentravellerProfile) profilesByOwner;
    mapping(string => address) ownersByNicknames;
    mapping(uint256 => DecentravellerDataTypes.DecentravellerRule) ruleById;

    constructor(
        address _governance,
        address _placesFactory,
        string[] memory initialRules
    ) {
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

    function registerProfile(
        string calldata _nickname,
        string calldata _country,
        DecentravellerDataTypes.DecentravellerPlaceCategory _interest
    ) public returns (address owner) {
        address nicknameOwner = ownersByNicknames[_nickname];
        if (nicknameOwner != address(0) && nicknameOwner != msg.sender) {
            revert Profile__NicknameInUse(_nickname);
        }

        if (profilesByOwner[msg.sender].owner != address(0)) {
            // Nickname change
            delete ownersByNicknames[profilesByOwner[msg.sender].nickname];
        }

        ownersByNicknames[_nickname] = msg.sender;
        profilesByOwner[msg.sender].owner = msg.sender;
        profilesByOwner[msg.sender].nickname = _nickname;
        profilesByOwner[msg.sender].country = _country;
        profilesByOwner[msg.sender].interest = _interest;

        emit UpdatedProfile(msg.sender, _nickname, _country, _interest);

        return msg.sender;
    }

    function addPlace(
        string memory _name,
        string memory _latitude,
        string memory _longitude,
        string memory _physicalAddress,
        DecentravellerDataTypes.DecentravellerPlaceCategory category
    ) public onlyRegisteredAddress returns (uint256 placeId) {
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

    function approveProposedRule(uint256 ruleId) external onlyGovernance {
        ruleById[ruleId].status = DecentravellerDataTypes
            .DecentravellerRuleStatus
            .APPROVED;
        emit DecentravellerRuleApproved(ruleId);
    }

    function proposeToGovernor(
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
        uint256 proposalId = proposeToGovernor(proposalCallData, ruleStatement);
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
        DecentravellerDataTypes.DecentravellerRule
            storage rule = getRuleByIdInternal(ruleId);
        rule.status = DecentravellerDataTypes.DecentravellerRuleStatus.DELETED;
        emit DecentravellerRuleDeleted(ruleId);
    }

    function createRuleDeletionProposal(
        uint256 ruleId
    ) external onlyRegisteredAddress {
        DecentravellerDataTypes.DecentravellerRule
            storage rule = getRuleByIdInternal(ruleId);
        bytes memory proposalCallData = abi.encodeWithSelector(
            this.deleteRule.selector,
            ruleId
        );
        uint256 deletionProposalId = proposeToGovernor(
            proposalCallData,
            string.concat("Delete rule: ", rule.statement)
        );
        rule.deleteProposalId = deletionProposalId;
        rule.deletionProposer = msg.sender;
        emit DecentravellerRuleDeletionProposed(
            ruleId,
            msg.sender,
            block.timestamp
        );
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

    function getRuleByIdInternal(
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
}
