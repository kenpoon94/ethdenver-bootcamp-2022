import { canDeploy, getSigner } from "../../utils/General";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { ethers } from "hardhat";
dotenv.config({ path: "../.env" });

const tokenContractAddress = process.argv[2];
const args = process.argv[3];

const { META_2, META_3, META_4, META_5 } = process.env;
async function main() {
  const meta = [META_2, META_3, META_4, META_5];
  let accNumber: number;
  if (args) accNumber = parseInt(args[0]);
  else throw new Error("No account number entered");

  let tokenContractFactory: MyToken__factory;
  let signer;

  [signer, tokenContractFactory] = await Promise.all([
    getSigner(meta[accNumber]),
    ethers.getContractFactory("MyToken"),
  ]);
  await canDeploy(signer);
  console.log(`${signer.address} is self delegating`);

  const tokenContract = tokenContractFactory.attach(tokenContractAddress);
  const delegateTx = tokenContract.connect(signer).delegate(signer.address);
  await (await delegateTx).wait();
  console.log(`${signer.address} has self delegated successfully`);
}
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
