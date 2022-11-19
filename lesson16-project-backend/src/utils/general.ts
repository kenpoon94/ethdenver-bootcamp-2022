import { ethers } from 'ethers';
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
