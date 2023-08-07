// SPDX-License-Identifier: UNLICENSED
// Declare the license type for the contract.

pragma solidity ^0.8.0;
// Specify the Solidity version to be used for compilation.

contract HelloWorld {
uint private value;
// Declare a private unsigned integer variable 'value'.

    function setValue(uint newValue) public {
    value = newValue;
    }
    // Function to set the value of 'value' variable to a new given 'newValue'.
    // Accessible publicly.

    function getValue() public view returns (uint) {
        return value;
    }
    // Function to retrieve the current value of 'value' variable.
    // Accessible publicly, but marked as 'view' to indicate it only reads data.

    function remove() public {
        selfdestruct(payable(address(0x0)));
    }
    // Function to self-destruct the contract and transfer any remaining ether to address 0x0 (burning the funds).
}