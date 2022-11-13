import { getSigner } from "../../utils/General";
import * as dotenv from "dotenv";
import { ethers } from "hardhat";
dotenv.config({ path: "../.env" });

const tokenContractAddress = process.argv[2]; // 0x79445Cd7183D958290fA104d4329D5B568E5D290

async function main() {
  const contractFactory = await ethers.getContractFactory("TokenizedBallot");
  const contract = contractFactory.attach(tokenContractAddress);

  let signer = getSigner();
  await contract
    .connect(signer)
    .winnerName()
    .then((vp) => {
      console.log(vp)
      console.log(
        `Winning proposal is ${ethers.utils.formatBytes32String(vp)}`
      );
    });
}
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
