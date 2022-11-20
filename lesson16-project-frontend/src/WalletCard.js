import React, { useState } from "react";
import { ethers } from "ethers";
import { tokenContract, tokenizedContract } from "./TokenContract";
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [votingPower, setVotingPower] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(false);

  const connectwalletHandler = () => {
    if (provider)
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(provider.getSigner());
      });
    else setErrorMessage("Please install Metamask!");
  };

  const accountChangedHandler = async (account) => {
    const address = await account.getAddress();
    setDefaultAccount(address);
    const balance = await account.getBalance();
    setUserBalance(ethers.utils.formatEther(balance));

    retrieveTokenizedBallotInfo(account);

    setConnectionStatus(true);
  };

  const retrieveTokenizedBallotInfo = async (account) => {
    let address = await account.getAddress();
    await tokenContract
      .connect(account)
      .balanceOf(address)
      .then((vp) => setTokenBalance(ethers.utils.formatEther(vp)));

    await tokenizedContract
      .connect(account)
      .votingPower(address)
      .then((vp) => {
        setVotingPower(ethers.utils.formatEther(vp));
      });
  };

  return (
    <div className="WalletCard">
      <h3 className="h4">Welcome to voting dapp</h3>
      <button
        style={{ background: defaultAccount ? "#A5CC82" : "white" }}
        onClick={connectwalletHandler}
      >
        {defaultAccount ? "Connected, press again to refresh" : "Connect"}
      </button>
      {connectionStatus && (
        <div className="displayAccount">
          <h4 className="walletAddress">Address: {defaultAccount}</h4>
          <div className="balanceDisplay">
            <h3>goerliETH Amount: {userBalance}</h3>
            <h3>MTK Amount: {tokenBalance}</h3>
            <h3>Voting Power: {votingPower}</h3>
          </div>
        </div>
      )}
      {errorMessage}
    </div>
  );
};
export default WalletCard;
