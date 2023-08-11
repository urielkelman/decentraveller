// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DecentravellerToken is ERC20Votes, Ownable {
    constructor()
        ERC20("DecentravellerToken", "DECT")
        ERC20Permit("DecentravellerToken")
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        _safeDelegate(to, to);
    }

    function _safeDelegate(address delegator, address delegatee) internal {
        require(address(this) == msg.sender, "Only the contract can delegate");
        _delegate(delegator, delegatee);
    }

    function _delegate(address delegator, address delegatee) internal override {
        super._delegate(delegator, delegatee);
    }

    // Ensure that no one else can call the public "delegate" function provided by ERC20Votes
    function delegate(address delegatee) public override {
        revert("This token doesn't allow external delegation");
    }
}
