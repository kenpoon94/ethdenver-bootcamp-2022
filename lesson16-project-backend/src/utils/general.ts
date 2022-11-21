import { ethers } from 'ethers';
import * as myToken from '../assets/MyToken.json';
import * as tokenizedBallot from '../assets/TokenizedBallot.json';
const tokenizedBallotAddress = '0x79445Cd7183D958290fA104d4329D5B568E5D290';
const myTokenAddress = '0xbed29Fae97B77B94ba96D403Ded28987448359dc';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

export const convertToBytes32Array = (array: string[]) => {
  const bytes32Array = array.map((x: string) =>
    ethers.utils.formatBytes32String(x),
  );
  return bytes32Array;
};

export const getSigner = (accountPath = process.env.META_1) => {
  const provider = ethers.getDefaultProvider('goerli', {
    etherscan: process.env.ETHERSCAN_API_KEY,
    alchemy: process.env.ALCHEMY_API_KEY,
  });
  const wallet = ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC ?? '',
    accountPath ?? '',
  );
  return wallet.connect(provider);
};

export const tokenContract = new ethers.ContractFactory(
  myToken.abi,
  myToken.bytecode,
).attach(myTokenAddress);

export const tokenizedContract = new ethers.ContractFactory(
  tokenizedBallot.abi,
  tokenizedBallot.bytecode,
).attach(tokenizedBallotAddress);
