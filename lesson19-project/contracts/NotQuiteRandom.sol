// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract NotQuiteRandom {
    function getRandomNumber()
        public
        view
        returns (uint256 notQuiteRandomNumber)
    {
        return uint256(blockhash(block.number - 1));
    }

    function tossCoin() public view returns (bool heads) {
        return getRandomNumber() % 2 == 0;
    }
}
