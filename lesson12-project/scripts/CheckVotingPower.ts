import { getSigner } from "../../utils/General";
import * as dotenv from "dotenv";
import { ethers } from "hardhat";
dotenv.config({ path: "../.env" });

const tokenContractAddress = process.argv[2]; // 0x79445Cd7183D958290fA104d4329D5B568E5D290

const { META_2, META_3, META_4, META_5 } = process.env;
async function main() {
  const meta = [META_2, META_3, META_4, META_5];

  const contractFactory = await ethers.getContractFactory("TokenizedBallot");
  const contract = contractFactory.attach(tokenContractAddress);

  meta.map(async (acc) => {
    let signer = getSigner(acc);
    await contract
      .connect(signer)
      .votingPower(signer.address)
      .then((vp) => {
        console.log(`Address ${signer.address} voting power = ${vp}`);
      });
  });
}
main().catch((error) => {
  console.log(error);
  process.exit(1);
});
