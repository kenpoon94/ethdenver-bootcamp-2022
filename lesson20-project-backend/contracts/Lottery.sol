// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LotteryToken} from "./Token.sol";

contract Lottery is Ownable {
    LotteryToken public paymentToken;
    uint256 public purchaseRatio;
    uint256 public betPrice;
    uint256 public betFee;
    uint256 public closingTimestamp;

    uint256 public ownerPool;
    uint256 public prizePool;
    mapping(address => uint256) public prize;

    bool public isBetOpen;

    address[] _slots;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _purchaseRatio,
        uint256 _betPrice,
        uint256 _betFee
    ) {
        paymentToken = new LotteryToken(name, symbol);
        purchaseRatio = _purchaseRatio;
        betPrice = _betPrice;
        betFee = _betFee;
    }

    function openBets(uint256 _closingTimestamp) external onlyOwner {
        require(isBetOpen == false, "The bets are already open!");
        require(
            _closingTimestamp > block.timestamp,
            "Closing time must be in the future!"
        );
        closingTimestamp = _closingTimestamp;
        isBetOpen = true;
    }

    function purchaseTokens() external payable {
        paymentToken.mint(msg.sender, msg.value * purchaseRatio);
    }

    function betMany(uint256 times) external {
        while (times > 0) {
            times--;
            bet();
        }
    }

    function bet() public onlyWhenBetsOpen {
        paymentToken.transferFrom(msg.sender, address(this), betPrice + betFee);
        prizePool += betPrice;
        ownerPool += betFee;
        _slots.push(msg.sender);
    }

    function closeLottery() external {
        require(closingTimestamp <= block.timestamp, "Too soon to close.");
        require(isBetOpen, "Bets are closed!");
        if (_slots.length > 0) {
            uint256 winnerIndex = getRandomNumber() % _slots.length;
            address winner = _slots[winnerIndex];
            prize[winner] += prizePool;
            prizePool = 0;
            delete (_slots);
        }
        isBetOpen = false;
    }

    function getRandomNumber() public view returns (uint256 randomNumber) {
        randomNumber = block.difficulty;
    }

    modifier onlyWhenBetsOpen() {
        require(isBetOpen, "Bets are closed!");
        require(
            closingTimestamp > block.timestamp,
            "The bet duration is over!"
        );
        _;
    }

    // Prize Withdraw
    function prizeWithdraw(uint256 amount) public {
        require(amount <= prize[msg.sender], "Not enough prize");
        prize[msg.sender] -= amount;
        paymentToken.transfer(msg.sender, amount);
    }

    // Owner Withdraw
    function ownerWithdraw(uint256 amount) public onlyOwner {
        require(amount <= ownerPool, "Not enough collected fees");
        ownerPool -= amount;
        paymentToken.transfer(msg.sender, amount);
    }

    // Return tokens
    function burnTokens(uint256 amount) public {
        paymentToken.burnTokens(msg.sender, amount);
        payable(msg.sender).transfer(amount / purchaseRatio);
    }
}
