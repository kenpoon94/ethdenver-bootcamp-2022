import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Vanilla", "Chocolate", "Peppermint"];

const convertToBytes32Array = (array: string[]) => {
  const bytes32Array = array.map((x: string) =>
    ethers.utils.formatBytes32String(x)
  );
  return bytes32Array;
};

describe("Ballot", () => {
  let ballotContract: Ballot;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    ballotContract = (await ballotContractFactory.deploy(
      convertToBytes32Array(PROPOSALS)
    )) as Ballot;
    await ballotContract.deployed();
  });

  describe("Contract deployment", async () => {
    it("Provided proposals", async () => {
      PROPOSALS.forEach(async (x, i) => {
        const proposals = await ballotContract.proposals(i);
        expect(
          PROPOSALS.includes(ethers.utils.parseBytes32String(proposals.name))
        ).to.eq(PROPOSALS[i]);
      });
    });

    it("Deployer address as chairperson", async () => {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(accounts[0].address);
    });

    it("Set voting weight for chairperson as 1 ", async () => {
      const chairpersonVoter = await ballotContract.voters(accounts[0].address);
      expect(chairpersonVoter.weight).to.eq(1);
    });

    describe("When the chairperson interacts with the giveRightToVote function in the contract", function () {
      beforeEach(async () => {
        const selectedVoter = accounts[1].address;
        await ballotContract
          .giveRightToVote(selectedVoter)
          .then((tx) => tx.wait());
      });

      it("Gives right to vote for another address", async function () {
        const acc1Voter = await ballotContract.voters(accounts[1].address);
        expect(acc1Voter.weight).to.be.eq(1);
      });

      it("Can not give right to vote for someone that has voted", async function () {
        await ballotContract.connect(accounts[1]).vote(1);
        await expect(
          ballotContract
            .connect(accounts[0])
            .giveRightToVote(accounts[1].address)
        ).to.be.reverted;
      });
      it("Can not give right to vote for someone that has already voting rights", async function () {
        const selectedVoter = accounts[1].address;
        await expect(
          ballotContract.giveRightToVote(selectedVoter)
        ).to.be.revertedWithoutReason();
      });
    });
  });
  describe("When the voter interact with the vote function in the contract", function () {
    beforeEach(async () => {
      const selectedVoter = accounts[1].address;
      await ballotContract
        .giveRightToVote(selectedVoter)
        .then((tx) => tx.wait());
    });

    it("Should register the vote", async () => {
      await ballotContract.connect(accounts[1]).vote(1);
      expect((await ballotContract.proposals(1)).voteCount).to.be.eq(1);
    });

    it("Can not register the vote because no voting rights", async () => {
      await expect(ballotContract.connect(accounts[2]).vote(1)).to.be.reverted;
      // to.be.revertedWith("Has no right to vote")
    });

    it("Can not register the vote because already voted", async () => {
      await ballotContract.connect(accounts[1]).vote(1);
      await expect(ballotContract.connect(accounts[1]).vote(2)).to.be.reverted;
      // to.be.revertedWith("Already voted.")
    });
  });

  describe("When the voter interact with the delegate function in the contract", function () {
    beforeEach(async () => {
      const selectedVoter = accounts[1].address;
      await ballotContract
        .giveRightToVote(selectedVoter)
        .then((tx) => tx.wait());
    });
    describe("Delegate to voter", () => {
      xit("Delegating to voter who has already voted", async () => {
        // await ballotContract.connect(accounts[1]).delegate(accounts[2].address);
        // delegated voter voted already
        // del
      });
      xit("Delegating to voter who has not voted", async () => {
        // await ballotContract.connect(accounts[1]).delegate(accounts[2].address);
        // delegated voter voted already
        // del
      });
    });
    // TODO

    it("Cannot delegate because already voted", async () => {
      await ballotContract.connect(accounts[1]).vote(1);
      await expect(
        ballotContract.connect(accounts[1]).delegate(accounts[2].address)
      ).to.be.reverted;
    });

    it("Cannot self-delegate", async () => {
      await expect(
        ballotContract.connect(accounts[1]).delegate(accounts[1].address)
      ).to.be.reverted;
    });
  });

  describe("When the an attacker interact with the giveRightToVote function in the contract", function () {
    // TODO
    xit("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("When the an attacker interact with the vote function in the contract", function () {
    // TODO
    xit("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("When the an attacker interact with the delegate function in the contract", function () {
    // TODO
    xit("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("When someone interact with the winningProposal function before any votes are cast", function () {
    // TODO
    xit("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("When someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    // TODO
    xit("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("When someone interact with the winnerName function before any votes are cast", function () {
    // TODO
    xit("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("When someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    // TODO
    xit("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("When someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    // TODO
    xit("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});
