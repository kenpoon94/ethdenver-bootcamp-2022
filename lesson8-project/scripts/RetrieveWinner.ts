import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { getSigner } from "../../utils/General";
import { ethers } from "hardhat";
dotenv.config({ path: "../.env" });

async function main() {
  console.log("Retrieving winning proposal");

  const contractAddress = process.argv[2];

  const signer = getSigner();

  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = ballotContractFactory.attach(contractAddress);
  let winner: string = "";
  await ballotContract
    .winnerName()
    .then((x) => (winner = ethers.utils.parseBytes32String(x)));
  console.log(`Current winning proposal is ${winner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
