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
      .then((mtk) => {
        if (mtk.isZero()) setTokenBalance(0);
        else setTokenBalance(ethers.utils.formatEther(mtk));
      });

    await tokenizedContract
      .connect(account)
      .votingPower(address)
      .then((vp) => {
        if (vp.isZero()) setVotingPower(0);
        else setVotingPower(ethers.utils.formatEther(vp));
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
            <TokenBalance tokenBalance={tokenBalance} />
            <VotingPower votingPower={votingPower} />
          </div>
        </div>
      )}
      {errorMessage}
    </div>
  );
};

const TokenBalance = ({ tokenBalance }) => {
  return (
    <div>
      <h3>MTK Amount: {tokenBalance}</h3>
      {!tokenBalance && <button>Mint</button>}
    </div>
  );
};

const VotingPower = ({ votingPower }) => {
  return (
    <div>
      <h3>Remain Voting Power: {votingPower}</h3>
      {votingPower !== 0 && (
        <div>
          <input type="number" placeholder="Voting Power"></input>
          <button>Vote</button>
        </div>
      )}
    </div>
  );
};
export default WalletCard;
