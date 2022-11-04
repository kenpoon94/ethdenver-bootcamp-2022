import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { getSigner } from "../utils/General";
dotenv.config();

async function main() {
  console.log("Deploying Ballot contract");

  const contractAddress = process.argv[2];
  const targetAddress = process.argv[3];

  const signer = getSigner();
  const balance = await signer.getBalance();

  if (balance.eq(0))
    throw new Error("Not enough balance to interact with contract");
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = ballotContractFactory.attach(contractAddress);
  const tx = await ballotContract.giveRightToVote(targetAddress);
  await tx.wait();

  console.log(`Right to vote has been given to ${targetAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
