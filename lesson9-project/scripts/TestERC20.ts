import { keccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";

const MINTER_ROLE_CODE =
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

async function main() {
  const accounts = await ethers.getSigners();
  const tokenContractFactory = await ethers.getContractFactory("MyToken");
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.deployed();
  console.log(`Contract deployed at  ${tokenContract.address}`);
  // Give role
  const roleTx = await tokenContract.grantRole(
    MINTER_ROLE_CODE,
    accounts[2].address
  );
  await roleTx.wait();
  // Minting Tokens
  const mintTx = await tokenContract
    .connect(accounts[2])
    .mint(accounts[0].address, 2);
  await mintTx.wait();

  // Sending a transaction
  const tx = await tokenContract.transfer(accounts[1].address, 1);
  await tx.wait();
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
  const myBalance0 = await tokenContract.balanceOf(accounts[0].address);
  const myBalance1 = await tokenContract.balanceOf(accounts[1].address);
  console.log(`Account balance 0 is ${myBalance0.toString()}`);
  console.log(`Account balance 1 is ${myBalance1.toString()}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
