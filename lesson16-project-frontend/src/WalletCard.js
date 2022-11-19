import React, { useState } from "react";
import { ethers } from "ethers";
console.log(window.provider);
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
//   : ethers.getDefaultProvider();
const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const connectwalletHandler = () => {
    if (provider)
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(provider.getSigner());
      });
    else setErrorMessage("Please install Metamask!");
  };

  const accountChangedHandler = async (newAccount) => {
    const network = await (await provider.getNetwork()).name;
    setNetwork(network);
    const address = await newAccount.getAddress();
    setDefaultAccount(address);
    const balance = await newAccount.getBalance();
    setUserBalance(ethers.utils.formatEther(balance));
    await getuserBalance(address);
  };

  const getuserBalance = async (address) => {
    const balance = await provider.getBalance(address, "latest");
  };
  return (
    <div className="WalletCard">
      {/* <img src={Ethereum} className="App-logo" alt="logo" /> */}
      <h3 className="h4">Welcome to a decentralized Application</h3>
      <button
        style={{ background: defaultAccount ? "#A5CC82" : "white" }}
        onClick={connectwalletHandler}
      >
        {defaultAccount ? "Connected!!" : "Connect"}
      </button>
      <div className="displayAccount">
        <h4 className="netWork">Network: {network}</h4>
        <h4 className="walletAddress">Address: {defaultAccount}</h4>
        <div className="balanceDisplay">
          <h3>
            Wallet Amount: {userBalance}{" "}
            {userBalance && network == "goerli" ? "GoerliETH" : "ETH"}
          </h3>
        </div>
      </div>
      {errorMessage}
    </div>
  );
};
export default WalletCard;
