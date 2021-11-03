// SPDX-License-Identifier: NO LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract STCHToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("STCH TOKEN", "STCH") {
        _mint(msg.sender, initialSupply);
    }
}