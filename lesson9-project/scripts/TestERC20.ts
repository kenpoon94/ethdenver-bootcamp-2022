import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

async function main() {
  const tokenContractFactory = await ethers.getContractFactory("MyToken");
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.deployed();
  console.log(`Contract deployed at  ${tokenContract.address}`);
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
    tokenContract.totalSupply(),
  ]);
  console.log({
    name,
    symbol,
    decimals,
    totalSupply,
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
