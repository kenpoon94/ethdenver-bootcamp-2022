import { getSigner } from "../../utils/General";

async function main() {
  const signer1 = getSigner(process.env.META_1);
  await signer1.getBalance().then((balance) => {
    console.log(`Signer 1 balance : ${balance.toString()}`);
  });
  const signer2 = getSigner(process.env.META_2);
  await signer2.getBalance().then((balance) => {
    console.log(`Signer 2 balance : ${balance.toString()}`);
  });
  const signer3 = getSigner(process.env.META_3);
  await signer3.getBalance().then((balance) => {
    console.log(`Signer 3 balance : ${balance.toString()}`);
  });
  const signer4 = getSigner(process.env.META_4);
  await signer4.getBalance().then((balance) => {
    console.log(`Signer 4 balance : ${balance.toString()}`);
  });
  const signer5 = getSigner(process.env.META_5);
  await signer5.getBalance().then((balance) => {
    console.log(`Signer 5 balance : ${balance.toString()}`);
  });
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
