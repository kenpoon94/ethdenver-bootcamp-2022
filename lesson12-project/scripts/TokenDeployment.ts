import { canDeploy, getSigner } from "../../utils/General";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

async function main() {
  const signer = getSigner();
  await canDeploy(signer);
  console.log(`${signer.address} is deploying TokenDeployment contract`);

  const contractFactory = new MyToken__factory(signer);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`The MyToken contract was deployed at ${contract.address}`);
}
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
