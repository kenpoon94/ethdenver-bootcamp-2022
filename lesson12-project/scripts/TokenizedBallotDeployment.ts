import { sign } from "crypto";
import {
  convertToBytes32Array,
  getSigner,
  isBalanceZero,
} from "../../utils/General";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const PROPOSALS = process.argv.slice(2);

async function main() {
  const signer = getSigner();
  if (await isBalanceZero(signer))
    throw new Error("Not enough balance to deploy");
  console.log(`${signer.address} is deploying smart contract(s) `);

  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  // const contractFactory1 = new MyToken__factory(signer);
  // const contract1 = await contractFactory1.deploy();
  // await contract1.deployed();
  // console.log(`The MyToken contract was deployed at ${contract1.address}`);

  // const contractFactory2 = new TokenizedBallot__factory(signer);
  // const contract2 = await contractFactory2.deploy(
  //   convertToBytes32Array(PROPOSALS),
  //   contract1.address,
  //   0 // NEED TO CHANGE
  // );
  // await contract2.deployed();
  // console.log(
  //   `The TokenizedBallot contract was deployed at ${contract2.address}`
  // );
}
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
