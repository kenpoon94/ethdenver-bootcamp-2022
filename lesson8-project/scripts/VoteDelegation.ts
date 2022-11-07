import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { getSigner } from "../utils/General";
dotenv.config();

async function main() {
  const contractAddress = process.argv[2];
  const targetAddress = process.argv[3];
  console.log(`Delegate vote to ${targetAddress}`);

  const signer = getSigner(process.env.SECONDARY_ACCOUNT_PATH);
  const balance = await signer.getBalance();

  if (balance.eq(0))
    throw new Error("Not enough balance to interact with contract");
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = ballotContractFactory.attach(contractAddress);
  const tx = await ballotContract.delegate(targetAddress);
  await tx.wait();

  console.log(`Vote has been delegated to ${targetAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
