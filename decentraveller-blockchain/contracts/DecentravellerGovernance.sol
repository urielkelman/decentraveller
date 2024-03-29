// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract DecentravellerGovernance is
    Context,
    Governor,
    GovernorSettings,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl,
    GovernorCountingSimple
{
    constructor(
        IVotes token,
        TimelockController _timelock
    )
        Governor("Decentraveller Governor")
        GovernorSettings(3 hours, 2 days, 10)
        GovernorVotes(token)
        GovernorVotesQuorumFraction(5)
        GovernorTimelockControl(_timelock)
    {}

    function _msgSender() internal view override returns (address) {
        return tx.origin;
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function currentVotes(address account) external view returns (uint256) {
        return token.getVotes(account);
    }
}
