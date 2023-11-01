// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

error Delegation__Fobidden();
error Transfer__Forbidden();
error Holders__NotEnough(uint256 currentHolders);

contract DecentravellerToken is ERC20Votes, AccessControl {
    uint8 private newReviewRewardAmount;
    uint8 private newPlaceRewardAmount;
    address[] private tokenHolders;
    mapping(address => bool) isHolder;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor(
        uint8 _newReviewRewardAmount,
        uint8 _newPlaceRewardAmount
    ) ERC20("DecentravellerToken", "DECT") ERC20Permit("DecentravellerToken") {
        newReviewRewardAmount = _newReviewRewardAmount;
        newPlaceRewardAmount = _newPlaceRewardAmount;
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function addMinters(
        address[] memory minters
    ) external onlyRole(ADMIN_ROLE) {
        uint mintersLength = minters.length;
        for (uint i = 0; i < mintersLength; i++) {
            _grantRole(MINTER_ROLE, minters[i]);
        }
    }

    function reward(address to, uint amount) internal {
        _mint(to, amount);
        _delegate(to, to);
        if (!isHolder[to]) {
            tokenHolders.push(to);
            isHolder[to] = true;
        }
    }

    function rewardNewPlace(address to) external onlyRole(MINTER_ROLE) {
        reward(to, newPlaceRewardAmount);
    }

    function rewardNewReview(address to) external onlyRole(MINTER_ROLE) {
        reward(to, newReviewRewardAmount);
    }

    function delegate(address) public pure override {
        revert Delegation__Fobidden();
    }

    function transfer(address, uint256) public pure override returns (bool) {
        revert Transfer__Forbidden();
    }

    function approve(address, uint256) public pure override returns (bool) {
        revert Transfer__Forbidden();
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

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    function getRandomHolders(
        uint8 amount
    ) external view returns (address[] memory) {
        uint256 tokenHoldersLenght = tokenHolders.length;

        if (amount > tokenHoldersLenght) {
            revert Holders__NotEnough(tokenHoldersLenght);
        }

        uint256 randomSeed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    block.coinbase,
                    block.gaslimit
                )
            )
        );

        address[] memory randomHolders = new address[](amount);

        for (uint i = 0; i < amount; i++) {
            /* TODO: Check if is a repeated address. */
            uint256 randomIndex = (uint256(
                keccak256(abi.encode(randomSeed, i))
            ) % tokenHoldersLenght);
            console.log(randomIndex);
            randomHolders[i] = tokenHolders[randomIndex];
            console.log("tutu", randomIndex);
        }

        return randomHolders;
    }
}
