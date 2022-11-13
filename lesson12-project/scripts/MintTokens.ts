import { getSigner, isBalanceZero } from "../../utils/General";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { ethers } from "hardhat";
dotenv.config({ path: "../.env" });

const args = process.argv.slice(2);
let tokenContractAddress: string;
let mintDestinationAddress: string;
let mintAmount: string;
if (typeof args[0] === "string") tokenContractAddress = args[0];
if (typeof args[1] === "string") mintDestinationAddress = args[1];
if (typeof args[2] === "string") mintAmount = args[2];

async function main() {
  let tokenContractFactory: MyToken__factory;
  let signer;

  if (!tokenContractAddress)
    throw new Error("Unable to mint due to missing token contract address");
  if (!mintDestinationAddress)
    throw new Error("Unable to mint due to missing mint destination address");
  if (!mintAmount) throw new Error("Unable to mint due to 0 mint amount");
  console.log(`Token Contract Address: ${tokenContractAddress}`);
  console.log(`Mint Destination Address: ${mintDestinationAddress}`);
  console.log(`Mint Amount: ${mintAmount}`);

  [signer, tokenContractFactory] = await Promise.all([
    getSigner(),
    ethers.getContractFactory("MyToken"),
  ]);

  if (await isBalanceZero(signer))
    throw new Error("Not enough balance to deploy");
  console.log(`${signer.address} is minting ${mintAmount} tokens`);

  const tokenContract = tokenContractFactory.attach(tokenContractAddress);
  const mintTx = await tokenContract
    .connect(signer)
    .mint(mintDestinationAddress, ethers.utils.parseEther(mintAmount));
  await mintTx.wait();
  console.log(
    `Minted ${mintAmount.toString()} to account ${mintDestinationAddress}`
  );
}
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
