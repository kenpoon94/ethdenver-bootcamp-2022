# Lesson 7 - Coding Ballot.sol
## (Review) Coding in VS Code
* Syntax for typescript scripts
* How the project operates
* Writing a test file
* Using Ethers.js library
* Using Hardhat toolbox
* Using Typechain library
* Testing syntax
* Running a test file
### References
https://docs.ethers.io/v5/

https://hardhat.org/hardhat-runner/docs/getting-started#overview

https://mochajs.org/

https://hardhat.org/hardhat-chai-matchers/docs/overview

https://www.chaijs.com/guide/

https://github.com/dethcrypto/TypeChain

## Introduction for Ballot.sol
* Scenario strategy
* The Ballot contract
* Giving voting rights
* Voting
* Delegating
* Proposals
### Reference
https://docs.soliditylang.org/en/latest/solidity-by-example.html#voting

## Writing unit tests for Ballot.sol
* More on Ether.js functions and utilities
* Bytes32 and Strings conversion
* Helper functions inside test scripts
* Unit tests structure and nested tests
### Code reference for tests
<pre><code>import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
  let ballotContract: Ballot;

  beforeEach(async function () {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      // TODO
      throw Error("Not implemented");
    });
    it("sets the deployer address as chairperson", async function () {
      // TODO
      throw Error("Not implemented");
    });
    it("sets the voting weight for the chairperson as 1", async function () {
      // TODO
      throw Error("Not implemented");
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      // TODO
      throw Error("Not implemented");
    });
    it("can not give right to vote for someone that has voted", async function () {
      // TODO
      throw Error("Not implemented");
    });
    it("can not give right to vote for someone that has already voting rights", async function () {
      // TODO
      throw Error("Not implemented");
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    // TODO
    it("should register the vote", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    // TODO
    it("should transfer voting power", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    // TODO
    it("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});
</code></pre>