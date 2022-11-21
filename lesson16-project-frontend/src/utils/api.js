import { ethers } from "ethers";
import { tokenContract, tokenizedContract } from "./general";
const host = "http://localhost:3000";

export const mintTokens = async (address, amount) => {
  await fetch(`${host}/mint`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address }),
  })
    .then((res) => res.json())
    .then((responseJson) => {
      return responseJson;
    });
};

export const vote = async (account) => {
  await tokenizedContract.connect(account).vote();
};

export const getTokenBalance = async (account, address) => {
  await tokenContract
    .connect(account)
    .balanceOf(address)
    .then((mtk) => {
      return mtk.isZero ? 0 : ethers.utils.formatEther(mtk);
    });
};

export const getVotingPower = async (account, address) => {
  await tokenizedContract
    .connect(account)
    .votingPower(address)
    .then((vp) => {
      return vp.isZero ? 0 : ethers.utils.formatEther(vp);
    });
};

export const getWinner = async (account) => {
  await tokenizedContract
    .connect(account)
    .winnerName()
    .then((proposals) => {
      return ethers.utils.parseBytes32String(proposals);
    });
};
