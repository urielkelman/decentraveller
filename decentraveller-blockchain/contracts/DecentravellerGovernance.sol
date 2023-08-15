// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";

contract DecentravellerGovernance is GovernorCountingSimple {
    constructor(string memory name) Governor(name) {}

    function votingDelay() public view virtual override returns (uint256) {}

    function votingPeriod() public view virtual override returns (uint256) {}

    function quorum(
        uint256 blockNumber
    ) public view virtual override returns (uint256) {}

    function _getVotes(
        address account,
        uint256 blockNumber,
        bytes memory params
    ) internal view virtual override returns (uint256) {}
}
