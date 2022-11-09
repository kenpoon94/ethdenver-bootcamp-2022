// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IMyERC20 {
    function mint(address to, uint256 amount) external;
}

contract TokenSale {
    uint256 public ratio;
    IMyERC20 public paymentToken;

    constructor(uint256 _ratio, address _paymentToken) {
        ratio = _ratio;
        paymentToken = IMyERC20(_paymentToken);
    }

    function buyTokens() external payable {
        uint256 amountToBeMinted = msg.value / ratio;
        paymentToken.mint(msg.sender, amountToBeMinted);
    }
}
