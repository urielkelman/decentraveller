// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library DecentravellerUtils {
    function isAddressSelected(
        address[] memory selectedAddresses,
        address newSelectedAddress,
        uint8 count
    ) internal pure returns (bool) {
        for (uint8 i = 0; i < count; i++) {
            if (selectedAddresses[i] == newSelectedAddress) {
                return true;
            }
        }
        return false;
    }
}
