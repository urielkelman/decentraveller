// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";

contract DecentravellerGovernance is GovernorCountingSimple {
    constructor(string memory name) Governor(name) {}
}
