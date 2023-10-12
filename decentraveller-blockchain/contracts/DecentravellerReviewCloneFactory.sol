// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./DecentravellerReview.sol";
import "./DecentravellerToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Place__NonRegistered(address placeAddress);

contract DecentravellerReviewCloneFactory is Ownable {
    address private immutable decentravellerReviewImplementation;
    DecentravellerToken private decentravellerToken;
    mapping(address => bool) private placeAddressesRegistered;

    event NewReview(
        uint256 indexed reviewId,
        uint256 indexed placeId,
        address owner,
        string reviewText,
        string[] imagesHashes,
        uint8 score
    );

    modifier onlyRegisteredPlace() {
        bool isRegistered = placeAddressesRegistered[msg.sender];
        if (!isRegistered) {
            revert Place__NonRegistered(msg.sender);
        }
        _;
    }

    constructor(address _decentravellerReviewImplementation, address _token) {
        decentravellerReviewImplementation = _decentravellerReviewImplementation;
        decentravellerToken = DecentravellerToken(_token);
    }

    function createNewReview(
        uint256 _reviewId,
        uint256 _placeId,
        address _owner,
        string memory _reviewText,
        string[] memory _imagesHashes,
        uint8 _score
    ) external onlyRegisteredPlace returns (address) {
        address reviewCloneAddress = Clones.clone(
            decentravellerReviewImplementation
        );
        DecentravellerReview(reviewCloneAddress).initialize(
            _reviewId,
            _placeId,
            _owner,
            _reviewText,
            _imagesHashes,
            _score,
            owner()
        );

        decentravellerToken.rewardNewReview(_owner);

        emit NewReview(
            _reviewId,
            _placeId,
            _owner,
            _reviewText,
            _imagesHashes,
            _score
        );
        return reviewCloneAddress;
    }

    function registerPlaceAddress(address _placeAddress) external onlyOwner {
        placeAddressesRegistered[_placeAddress] = true;
    }
}
