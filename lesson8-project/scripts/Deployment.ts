import { Ballot__factory } from "../typechain-types";
import { convertToBytes32Array, getSigner } from "../utils/General";
import * as dotenv from "dotenv";
dotenv.config();

const PROPOSALS = process.argv.slice(2);

async function main() {
  console.log("Deploying Ballot contract");

  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const signer = getSigner();
  const balance = await signer.getBalance();

  if (balance.eq(0)) throw new Error("Not enough balance to deploy contract");
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.deploy(
    convertToBytes32Array(PROPOSALS)
  );
  await ballotContract.deployed();

  console.log(
    `The ballot smart contract was deployed at ${ballotContract.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
