import React, { useState } from "react";
import { ethers } from "ethers";
import {
  mintTokens,
  getTokenBalance,
  getVotingPower,
  getWinner,
} from "./utils/api";
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const PROPOSALS = ["Vanilla", "Peppermint", "Chocolate"];

const VotingDashboard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [votingPower, setVotingPower] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [winner, setWinner] = useState(null);

  const connectwalletHandler = () => {
    if (provider)
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler();
      });
    else setErrorMessage("Please install Metamask!");
  };

  const accountChangedHandler = async () => {
    await refreshAccount();
    setConnectionStatus(true);
  };

  const refreshAccount = async () => {
    const account = provider.getSigner();
    const address = await account.getAddress();
    setDefaultAccount(address);
    const balance = await account.getBalance();
    setUserBalance(ethers.utils.formatEther(balance));
    retrieveTokenizedBallotInfo(account);
  };

  const retrieveTokenizedBallotInfo = async () => {
    const account = provider.getSigner();
    let address = await account.getAddress();
    await getTokenBalance(account, address).then((bal) => {
      console.log("Balance", bal);
      setTokenBalance(bal);
    });
    await getVotingPower(account, address).then((vp) => {
      console.log("Voting Power", vp);
      setVotingPower(vp);
    });
    await getWinner(account).then((winner) => {
      console.log("Winner", winner);
      setWinner(winner);
    });
  };

  const mint = async () => {
    setIsMinting(true);
    await mintTokens(defaultAccount, null).then((res) => {
      setIsMinting(false);
      refreshAccount();
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
            <TokenBalance
              tokenBalance={tokenBalance}
              mint={mint}
              disabled={isMinting}
            />
            <VotingPower votingPower={votingPower} />
          </div>
          <hr />
          {winner && <WinningTable winner={winner} />}
        </div>
      )}
      {errorMessage}
    </div>
  );
};

const WinningTable = (winner) => {
  return (
    <div className="center">
      <table>
        <tr>
          <th>Winner</th>
        </tr>
        <tr>
          <td>{winner ? winner : "Loading"}</td>
        </tr>
      </table>
    </div>
  );
};

const TokenBalance = ({ tokenBalance, mint, disabled }) => {
  return (
    <div>
      <h3>MTK Amount: {tokenBalance}</h3>
      <button disabled={disabled} onClick={mint}>
        {disabled ? "Minting" : "Mint"}
      </button>
    </div>
  );
};

const VotingPower = ({ votingPower }) => {
  return (
    <div>
      <h3>Remaining Voting Power: {votingPower}</h3>
      {votingPower !== 0 && (
        <div>
          <input type="number" placeholder="Voting Power"></input>
          <div>
            {PROPOSALS.map((x) => {
              return <button>Vote {x}</button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default VotingDashboard;
