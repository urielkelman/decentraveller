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

contract Decentraveller {
    struct DecentravellerRule {
        uint256 proposalId;
        DecentravellerDataTypes.DecentravellerRuleStatus status;
        address proposer;
        string statement;
    }

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
        uint256 proposalId
    );

    event DecentravellerRuleApproved(uint256 indexed ruleId);

    DecentravellerGovernance governance;
    DecentravellerPlaceCloneFactory placeFactory;

    uint256 private currentPlaceId;
    uint256 private currentRuleId;

    mapping(uint256 => address) private placeAddressByPlaceId;
    mapping(string => uint) private placeIdByPlaceLocation;
    mapping(address => DecentravellerDataTypes.DecentravellerProfile) profilesByOwner;
    mapping(string => address) ownersByNicknames;
    mapping(uint256 => DecentravellerRule) ruleById;

    constructor(address _governance, address _placesFactory) {
        governance = DecentravellerGovernance(payable(_governance));
        placeFactory = DecentravellerPlaceCloneFactory(_placesFactory);
        currentPlaceId = 0;
        currentRuleId = 0;
    }

    modifier onlyGovernance() {
        if (msg.sender != address(governance)) {
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
        ruleById[currentRuleId] = DecentravellerRule({
            proposalId: proposalId,
            status: DecentravellerDataTypes
                .DecentravellerRuleStatus
                .PENDING_APPROVAL,
            proposer: msg.sender,
            statement: ruleStatement
        });
        emit DecentravellerRuleProposed(
            currentRuleId,
            msg.sender,
            ruleStatement,
            proposalId
        );
        return currentRuleId;
    }

    function getRuleById(
        uint256 ruleId
    ) external view returns (DecentravellerRule memory) {
        DecentravellerRule memory rule = ruleById[ruleId];
        if (rule.proposer == address(0)) {
            revert Rule__NonExistent(ruleId);
        }
        return rule;
    }
}
