import React, { useState } from "react";
import { ethers } from "ethers";
import { mintTokens, getTokenBalance } from "./utils/api";
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const VotingDashboard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isBetOpen, setIsBetOpen] = useState(false);

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
    // setIsBetClosed
    // setIsWinner
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
      <h3 className="h4">Welcome to lottery dapp</h3>
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
            <Prize prizepool={1000} isWinner={true} />
            <Bet isBetOpen={true} />
          </div>
        </div>
      )}
      {errorMessage}
    </div>
  );
};

const Prize = ({ disabled, prizepool, isWinner, claim }) => {
  return isWinner ? (
    <div>
      <h2>{`Congratulations you are the winner of ${prizepool}`}</h2>
      <input type="number" placeholder="Claim amount"></input>
      <div>
        <button disabled={disabled} onClick={claim}>
          {disabled ? "Claiming ..." : "Claim prize"}
        </button>
      </div>
    </div>
  ) : (
    <div className="center">
      <h2>{`Current prize pool is at ${prizepool}`}</h2>
    </div>
  );
};

const TokenBalance = ({ tokenBalance, mint, disabled }) => {
  return (
    <div>
      <h3>LTK Amount: {tokenBalance}</h3>
      <input type="number" placeholder="Amount"></input>
      <div>
        <button disabled={disabled} onClick={mint}>
          {disabled ? "Wait ..." : "Top up tokens"}
        </button>
      </div>
    </div>
  );
};

const Bet = ({ isBetOpen }) => {
  // Check if bet is opened
  return isBetOpen ? (
    <div>
      <h3>Place your bets now!</h3>
      <div>
        <label>How many bets to place?</label>
        <div>
          <input type="number" placeholder="Amount of bets"></input>
        </div>
        <div>
          <button>Place bet</button>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <h3>Bet is currently closed.</h3>
    </div>
  );
};
export default VotingDashboard;
