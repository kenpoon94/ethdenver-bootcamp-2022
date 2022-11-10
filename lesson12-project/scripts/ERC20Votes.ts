import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

let MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
  const accounts = await ethers.getSigners();
  // Contract deployment
  const contractFactory = new MyToken__factory(accounts[0]);
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait();
  console.log(`Contract deployed at ${contract.address}`);

  // Mint tokens
  const mintTx = await contract.mint(accounts[1].address, MINT_VALUE);
  await mintTx.wait();
  console.log(
    `Minted ${MINT_VALUE.toString()} to account ${accounts[1].address}`
  );

  // Check voting power
  const votes = await contract.getVotes(accounts[1].address);
  console.log(
    `Account ${
      accounts[1].address
    } has ${votes.toString()} units of voting power before self delegating`
  );

  // Self delegate to activate checkpoint
  const delegateTx = await contract
    .connect(accounts[1])
    .delegate(accounts[1].address);
  await delegateTx.wait();

  // Check voting power
  const votes2 = await contract.getVotes(accounts[1].address);
  console.log(
    `Account ${
      accounts[1].address
    } has ${votes2.toString()} units of voting power after self delegating`
  );

  // Transfer tokens
  const transferTx = await contract
    .connect(accounts[1])
    .transfer(accounts[2].address, MINT_VALUE.div(2));
  await transferTx.wait();

  // Check voting power
  const votes3 = await contract.getVotes(accounts[1].address);
  console.log(
    `Account ${
      accounts[1].address
    } has ${votes3.toString()} units of voting power after transfer`
  );

  // Check voting power
  const votes4 = await contract.getVotes(accounts[2].address);
  console.log(
    `Account ${
      accounts[2].address
    } has ${votes4.toString()} units of voting power after transfer`
  );

  // Check past voting power
  const lastBlock = await ethers.provider.getBlock("latest");
  const votes5 = await contract.getPastVotes(
    accounts[1].address,
    lastBlock.number - 1
  );
  console.log(
    `Account ${
      accounts[1].address
    } had ${votes5.toString()} units of voting power at previous block`
  );
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
