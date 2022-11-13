import { mineBlocks } from "../../utils/General";

const { expect } = require("chai");
const { ethers } = require("hardhat");

const args = process.argv[2];

async function main() {
  const sevenDays = 7 * 24 * 60 * 60;
  let blocksToMine: number = args && args != "0" ? parseInt(args) : 0;
  if (blocksToMine == 0) return;

  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  const timestampBefore = blockBefore.timestamp;

  await ethers.provider.send("evm_increaseTime", [sevenDays]);
  await mineBlocks(blocksToMine);

  const blockNumAfter = await ethers.provider.getBlockNumber();
  const blockAfter = await ethers.provider.getBlock(blockNumAfter);
  const timestampAfter = blockAfter.timestamp;

  expect(blockNumAfter).to.be.equal(blockNumBefore + blocksToMine);
  expect(timestampAfter).to.be.equal(timestampBefore + sevenDays + 1);
  console.log("Fast forwarded successfully");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
