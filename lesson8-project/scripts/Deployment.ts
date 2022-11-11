import { Ballot__factory } from "../typechain-types";
import {
  convertToBytes32Array,
  getSigner,
  isBalanceZero,
} from "../../utils/General";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const PROPOSALS = process.argv.slice(2);

async function main() {
  const signer = getSigner();
  if (await isBalanceZero(signer))
    throw new Error("Not enough balance to deploy contract");
  console.log(`${signer.address} is deploying smart contract(s) `);

  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const contractFactory = new Ballot__factory(signer);
  const contract = await contractFactory.deploy(
    convertToBytes32Array(PROPOSALS)
  );
  await contract.deployed();

  console.log(`The ballot smart contract was deployed at ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
