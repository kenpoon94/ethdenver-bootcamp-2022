import {
  canDeploy,
  convertToBytes32Array,
  getSigner,
} from "../../utils/General";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

let blockNumber: number = 0;
let proposals: string[];
let tokenContractAddress: string;
const args = process.argv.slice(2);
if (typeof args[0] === "string") tokenContractAddress = args[0];
if (typeof args[1] === "string") blockNumber = parseInt(args[1]);
if (typeof args.slice(2) === "object") proposals = args.slice(2);

async function main() {
  if (!tokenContractAddress)
    throw new Error(
      "Unable to deploy contract due to missing token contract address"
    );
  if (blockNumber == 0)
    throw new Error("Unable to deploy contract due to missing blockNumber");
  if (proposals.length < 2)
    throw new Error("Unable to deploy contract due to less than 2 proposals");
  console.log(`Token Contract Address: ${tokenContractAddress}`);
  console.log(`Block Number: ${blockNumber}`);
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const signer = getSigner();
  await canDeploy(signer);
  console.log(`${signer.address} is deploying TokenizedBallot contract`);

  const contractFactory = new TokenizedBallot__factory(signer);
  const contract = await contractFactory.deploy(
    convertToBytes32Array(proposals),
    tokenContractAddress,
    blockNumber
  );
  await contract.deployed();
  console.log(
    `The TokenizedBallot contract was deployed at ${contract.address}`
  );
}
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
