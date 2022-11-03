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
});
