import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
import { convertToBytes32Array } from "../utils/General";

const PROPOSALS = ["Vanilla", "Chocolate", "Peppermint"];

async function main() {
  console.log("Deploying Test Ballot contract");

  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const ballotContractFactory = await ethers.getContractFactory("Ballot");
  const ballotContract = (await ballotContractFactory.deploy(
    convertToBytes32Array(PROPOSALS)
  )) as Ballot;
  await ballotContract.deployed();

  console.log("Contract has been deployed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
