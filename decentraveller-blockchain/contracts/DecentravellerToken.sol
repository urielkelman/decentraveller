// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

error Delegation__Fobidden();

contract DecentravellerToken is ERC20Votes, AccessControl {
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
            console.log(minters[i]);
            _grantRole(MINTER_ROLE, minters[i]);
        }
    }

    function reward(address to, uint amount) internal {
        _mint(to, amount);
        _delegate(to, to);
    }

    function rewardNewPlace(address to) external onlyRole(MINTER_ROLE) {
        reward(to, newPlaceRewardAmount);
        _delegate(to, to);
    }

    function rewardNewReview(address to) external onlyRole(MINTER_ROLE) {
        reward(to, newReviewRewardAmount);
    }

    // Ensure that no one else can call the public "delegate" function provided by ERC20Votes
    function delegate(address) public pure override {
        revert Delegation__Fobidden();
    }

    function setNewReviewRewardAmount(
        uint8 _rewardAmount
    ) external onlyRole(ADMIN_ROLE) {
        newReviewRewardAmount = _rewardAmount;
    }

    function setNewPlacewRewardAmount(
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
