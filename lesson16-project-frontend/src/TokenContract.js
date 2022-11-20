import { ethers } from "ethers";
import myToken from "./assets/MyToken.json";
import tokenizedBallot from "./assets/TokenizedBallot.json";
const tokenizedBallotAddress = "0x79445Cd7183D958290fA104d4329D5B568E5D290";
const myTokenAddress = "0xbed29Fae97B77B94ba96D403Ded28987448359dc";

// eslint-disable-next-line import/no-anonymous-default-export
export const  
  tokenContract = new ethers.ContractFactory(
    myToken.abi,
    myToken.bytecode
  ).attach(myTokenAddress);

export const tokenizedContract = new ethers.ContractFactory(
    tokenizedBallot.abi,
    tokenizedBallot.bytecode
  ).attach(tokenizedBallotAddress);
