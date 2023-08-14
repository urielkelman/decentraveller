// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DecentravellerToken is ERC20Votes, Ownable, AccessControl {
    uint8 private newReviewRewardAmount;
    uint8 private newPlaceRewardAmount;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor(
        uint8 _newReviewRewardAmount,
        uint8 _newPlaceRewardAmount,
        address admin,
        address[] memory minters
    ) ERC20("DecentravellerToken", "DECT") ERC20Permit("DecentravellerToken") {
        newReviewRewardAmount = _newReviewRewardAmount;
        newPlaceRewardAmount = _newPlaceRewardAmount;
        _grantRole(ADMIN_ROLE, admin);
        uint mintersLength = minters.length;
        for (uint i = 0; i < mintersLength; i++) {
            _grantRole(MINTER_ROLE, minters[i]);
        }
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
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
    function delegate(address) public pure override {
        revert("This token doesn't allow external delegation");
    }

    function setNewReviewRewardableAmount(
        uint8 _rewardAmount
    ) external onlyRole(ADMIN_ROLE) {
        newReviewRewardAmount = _rewardAmount;
    }

    function setNewPlacewRewardableAmount(
        uint8 _rewardAmount
    ) external onlyRole(ADMIN_ROLE) {
        newPlaceRewardAmount = _rewardAmount;
    }

    function getAdminRole() external pure returns (bytes32) {
        return ADMIN_ROLE;
    }

    function getMinterRole() external pure returns (bytes32) {
        return MINTER_ROLE;
    }
}
