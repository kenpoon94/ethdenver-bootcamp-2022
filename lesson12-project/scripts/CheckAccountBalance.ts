import { getSigner } from "../../utils/General";

async function main() {
  const signer1 = getSigner(process.env.ACCOUNT_PATH);
  await signer1.getBalance().then((balance) => {
    console.log(`Signer 1 balance : ${balance.toString()}`);
  });
  const signer2 = getSigner(process.env.SECONDARY_ACCOUNT_PATH);
  await signer2.getBalance().then((balance) => {
    console.log(`Signer 2 balance : ${balance.toString()}`);
  });
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
