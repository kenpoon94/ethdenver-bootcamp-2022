const { ethers } = require("hardhat");
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const convertToBytes32Array = (array: string[]) => {
  const bytes32Array = array.map((x: string) =>
    ethers.utils.formatBytes32String(x)
  );
  return bytes32Array;
};

export const getSigner = (accountPath = process.env.META_1) => {
  const provider = ethers.getDefaultProvider("goerli", {
    etherscan: process.env.ETHERSCAN_API_KEY,
    alchemy: process.env.ALCHEMY_API_KEY,
  });
  const wallet = ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC ?? "",
    accountPath ?? ""
  );
  return wallet.connect(provider);
};

const isBalanceZero = async (signer: any) => {
  const balance = await signer.getBalance();
  return balance === 0 ? true : false;
};

export async function canDeploy(signer: any) {
  if (await isBalanceZero(signer))
    throw new Error("Not enough balance to interact");
}

export async function mineBlocks(blockNumber: number) {
  while (blockNumber > 0) {
    blockNumber--;
    await ethers.provider.send("evm_mine");
  }
}
