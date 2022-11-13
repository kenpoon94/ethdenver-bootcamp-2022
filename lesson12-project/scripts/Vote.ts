import { getSigner } from "../../utils/General";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { parse } from "path";
dotenv.config({ path: "../.env" });

const { META_2, META_3, META_4, META_5 } = process.env;
const [
  tokenizedBallotContractAddress,
  tokenContractAddress,
  accNumber,
  amount,
  selected,
] = process.argv.slice(2);
const PROPOSALS = ["Vanilla", "Peppermint", "Chocolate"];

async function main() {
  const meta = [META_2, META_3, META_4, META_5];
  if (
    !tokenizedBallotContractAddress ||
    !tokenContractAddress ||
    !accNumber ||
    !amount ||
    !selected
  )
    throw new Error("Invalid arguments");

  let tokenizedBallotFactory: TokenizedBallot__factory;
  let tokenFactory: MyToken__factory;
  let signer;
  [signer, tokenizedBallotFactory, tokenFactory] = await Promise.all([
    getSigner(meta[parseInt(accNumber)]),
    ethers.getContractFactory("TokenizedBallot"),
    ethers.getContractFactory("MyToken"),
  ]);
  const tokenizedBallotContract = tokenizedBallotFactory.attach(
    tokenizedBallotContractAddress
  );
  const tokenContract = tokenFactory.attach(tokenContractAddress);

  console.log(signer.address);
  await tokenContract
    .connect(signer)
    .balanceOf(signer.address)
    .then((balance) => {
        console.log("Balance", balance)
      if (ethers.utils.parseEther(amount).gt(balance))
        throw new Error("Do not have enough balance to vote");
    });

    console.log(
      `${signer.address} is voting for ${PROPOSALS[parseInt(selected)]}`
    );

    const voteTx = tokenizedBallotContract
      .connect(signer)
      .vote(selected, ethers.utils.parseEther(amount));
    await (await voteTx).wait();
    console.log(
      `${signer.address} has voted for ${
        PROPOSALS[parseInt(selected)]
      } successfully`
    );
}
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
