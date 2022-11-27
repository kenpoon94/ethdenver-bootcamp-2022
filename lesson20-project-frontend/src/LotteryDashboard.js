import React, { useState } from "react";
import { ethers } from "ethers";
import { mintTokens, getTokenBalance } from "./utils/api";
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const LotteryDashboard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(false);

  const [isMinting, setIsMinting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isBetting, setIsBetting] = useState(false);

  const [isWinner, setIsWinner] = useState(false);
  const [isBetOpen, setIsBetOpen] = useState(false);

  const [claimAmount, claimInput] = useInput({
    type: "number",
    placeholder: "Claim amount",
  });
  const [topUpAmount, topUpInput] = useInput({
    type: "number",
    placeholder: "Top up amount",
  });
  const [betTimes, betInput] = useInput({
    type: "number",
    placeholder: "Bet times",
  });

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
    console.log("Minting ", topUpAmount);
    setIsMinting(true);
    // await mintTokens(defaultAccount, null).then((res) => {
    //   setIsMinting(false);
    //   refreshAccount();
    // });
  };

  const bet = async () => {
    console.log("Betting: ", betTimes);
    setIsBetting(true);
    // await mintTokens(defaultAccount, null).then((res) => {
    //   setIsMinting(false);
    //   refreshAccount();
    // });
  };

  const claim = async () => {
    console.log("Claiming: ", claimAmount);
    setIsClaiming(true);
    // await mintTokens(defaultAccount, null).then((res) => {
    //   setIsMinting(false);
    //   refreshAccount();
    // });
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
              input={topUpInput}
              tokenBalance={tokenBalance}
              action={mint}
              disabled={isMinting}
              disabledButtonTxt={"Minting ..."}
              buttonTxt="Mint"
            />
            <Prize
              input={claimInput}
              prizepool={1000}
              isWinner={true}
              action={claim}
              disabled={isClaiming}
              disabledButtonTxt={"Claiming ..."}
              buttonTxt="Claim"
            />
            <Bet
              input={betInput}
              isBetOpen={true}
              action={bet}
              disabled={isBetting}
              disabledButtonTxt={"Betting ..."}
              buttonTxt="Bet"
            />
          </div>
        </div>
      )}
      {errorMessage}
    </div>
  );
};

const Prize = ({
  input,
  prizepool,
  isWinner,
  action,
  disabled,
  disabledButtonTxt,
  buttonTxt,
}) => {
  return isWinner ? (
    <div>
      <h2>{`Congratulations you are the winner of ${prizepool}`}</h2>
      {input}
      <Button
        disabled={disabled}
        action={action}
        disabledButtonTxt={disabledButtonTxt}
        buttonTxt={buttonTxt}
      />
    </div>
  ) : (
    <div className="center">
      <h2>{`Current prize pool is at ${prizepool}`}</h2>
    </div>
  );
};

const TokenBalance = ({
  input,
  tokenBalance,
  action,
  disabled,
  disabledButtonTxt,
  buttonTxt,
}) => {
  return (
    <div>
      <h3>LTK Amount: {tokenBalance}</h3>
      {input}
      <Button
        disabled={disabled}
        action={action}
        disabledButtonTxt={disabledButtonTxt}
        buttonTxt={buttonTxt}
      />
    </div>
  );
};

const Bet = ({
  input,
  isBetOpen,
  action,
  disabled,
  disabledButtonTxt,
  buttonTxt,
}) => {
  // Check if bet is opened
  return isBetOpen ? (
    <div>
      <h3>Place your bets now!</h3>
      <div>
        <label>How many bets to place?</label>
        <div>{input}</div>
        <Button
          disabled={disabled}
          action={action}
          disabledButtonTxt={disabledButtonTxt}
          buttonTxt={buttonTxt}
        />
      </div>
    </div>
  ) : (
    <div>
      <h3>Bet is currently closed.</h3>
    </div>
  );
};

const Button = ({ disabled, action, disabledButtonTxt, buttonTxt }) => {
  return (
    <div>
      <button disabled={disabled} onClick={action}>
        {disabled ? disabledButtonTxt : buttonTxt}
      </button>
    </div>
  );
};

function useInput({ type, placeholder }) {
  const [value, setValue] = useState("");
  const input = (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
    />
  );
  return [value, input];
}

export default LotteryDashboard;
