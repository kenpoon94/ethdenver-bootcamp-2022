# Lesson 19 - Randomness
## Randomness sources
* (Review) Block hash and timestamp
* (Review) Hashing and bytes conversion
* Creating a random number from block.hash and/or block.timestamp
* Mining exploitation
* False randomness

### Code references

NotQuiteRandom.sol:
```
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract NotQuiteRandom {
    function getRandomNumber()
        public
        view
        returns (uint256 notQuiteRandomNumber)
    {
        // TODO: get randomness from block hash
    }

    function tossCoin() public view returns (bool heads) {
        // TODO: make the random number be translated to a boolean
    }
}
```

Scripts:

```
async function blockHashRandomness() {
  const contractFactory = await ethers.getContractFactory("NotQuiteRandom");
  contractFactory.deploy().then(async (result) => {
    result.deployed().then(async (contract: NotQuiteRandom) => {
      const currentBlock = await ethers.provider.getBlock("latest");
      const randomNumber = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock.number}\nBlock hash: ${currentBlock.hash}\nRandom number from this block hash: ${randomNumber}`
      );
      await ethers.provider.send("evm_mine", [currentBlock.timestamp + 1]);
      const currentBlock2 = await ethers.provider.getBlock("latest");
      const randomNumber2 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock2.number}\nBlock hash: ${currentBlock2.hash}\nRandom number from this block hash: ${randomNumber2}`
      );
      await ethers.provider.send("evm_mine", [currentBlock2.timestamp + 1]);
      const currentBlock3 = await ethers.provider.getBlock("latest");
      const randomNumber3 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock3.number}\nBlock hash: ${currentBlock3.hash}\nRandom number from this block hash: ${randomNumber3}`
      );
      await ethers.provider.send("evm_mine", [currentBlock3.timestamp + 1]);
      const currentBlock4 = await ethers.provider.getBlock("latest");
      const randomNumber4 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock4.number}\nBlock hash: ${currentBlock4.hash}\nRandom number from this block hash: ${randomNumber4}`
      );
      await ethers.provider.send("evm_mine", [currentBlock4.timestamp + 1]);
      const currentBlock5 = await ethers.provider.getBlock("latest");
      const randomNumber5 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock5.number}\nBlock hash: ${currentBlock5.hash}\nRandom number from this block hash: ${randomNumber5}`
      );
    });
  });
}

async function tossCoin() {
  const contractFactory = await ethers.getContractFactory("NotQuiteRandom");
  contractFactory.deploy().then(async (result) => {
    result.deployed().then(async (contract: NotQuiteRandom) => {
      const currentBlock = await ethers.provider.getBlock("latest");
      const heads = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock.number}\nBlock hash: ${
          currentBlock.hash
        }\nThe coin landed as: ${heads ? "Heads" : "Tails"}`
      );
      await ethers.provider.send("evm_mine", [currentBlock.timestamp + 1]);
      const currentBlock2 = await ethers.provider.getBlock("latest");
      const heads2 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock2.number}\nBlock hash: ${
          currentBlock2.hash
        }\nThe coin landed as: ${heads2 ? "Heads" : "Tails"}`
      );
      await ethers.provider.send("evm_mine", [currentBlock2.timestamp + 1]);
      const currentBlock3 = await ethers.provider.getBlock("latest");
      const heads3 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock3.number}\nBlock hash: ${
          currentBlock3.hash
        }\nThe coin landed as: ${heads3 ? "Heads" : "Tails"}`
      );
      await ethers.provider.send("evm_mine", [currentBlock3.timestamp + 1]);
      const currentBlock4 = await ethers.provider.getBlock("latest");
      const heads4 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock4.number}\nBlock hash: ${
          currentBlock4.hash
        }\nThe coin landed as: ${heads4 ? "Heads" : "Tails"}`
      );
      await ethers.provider.send("evm_mine", [currentBlock4.timestamp + 1]);
      const currentBlock5 = await ethers.provider.getBlock("latest");
      const heads5 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock5.number}\nBlock hash: ${
          currentBlock5.hash
        }\nThe coin landed as: ${heads5 ? "Heads" : "Tails"}`
      );
    });
  });
}
```
### References
https://github.com/wissalHaji/solidity-coding-advices/blob/master/best-practices/timestamp-can-be-manipulated.md

https://fravoll.github.io/solidity-patterns/randomness.html

## Using signatures
* Elliptic encryption (review)
* Signing messages (review)
* Verifying signatures (review)
* Workaround for information asymmetry with commit-reveal

### Code references

PseudoRandom.sol:
>:warning: This code might look very scary at some points :warning:
>You don't need to understand the logic at `verifyString` function :ghost:

```
//SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract PseudoRandom {
    using ECDSA for bytes32;

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    Signature savedSig;

    function setSignature(
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public {
        savedSig = Signature({v: _v, r: _r, s: _s});
    }

    function getRandomNumber(string calldata seed)
        public
        view
        returns (uint256 pseudoRandomNumber)
    {
        address messageSigner = verifyString(
            seed,
            savedSig.v,
            savedSig.r,
            savedSig.s
        );
        require(msg.sender == messageSigner, "Invalid seed");
        pseudoRandomNumber = uint256(keccak256(abi.encodePacked(seed)));
    }

    function getCombinedRandomNumber(string calldata seed)
        public
        view
        returns (uint256 pseudoRandomNumber)
    {
        address messageSigner = verifyString(
            seed,
            savedSig.v,
            savedSig.r,
            savedSig.s
        );
        require(msg.sender == messageSigner, "Invalid seed");
        pseudoRandomNumber = uint256(
            keccak256(abi.encodePacked(seed, blockhash(block.number - 1)))
        );
    }

    function verifyString(
        string memory message,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public pure returns (address signer) {
        string memory header = "\x19Ethereum Signed Message:\n000000";
        uint256 lengthOffset;
        uint256 length;
        assembly {
            length := mload(message)
            lengthOffset := add(header, 57)
        }
        require(length <= 999999);
        uint256 lengthLength = 0;
        uint256 divisor = 100000;
        while (divisor != 0) {
            uint256 digit = length / divisor;
            if (digit == 0) {
                if (lengthLength == 0) {
                    divisor /= 10;
                    continue;
                }
            }
            lengthLength++;
            length -= digit * divisor;
            divisor /= 10;
            digit += 0x30;
            lengthOffset++;
            assembly {
                mstore8(lengthOffset, digit)
            }
        }
        if (lengthLength == 0) {
            lengthLength = 1 + 0x19 + 1;
        } else {
            lengthLength += 1 + 0x19;
        }
        assembly {
            mstore(header, lengthLength)
        }
        bytes32 check = keccak256(abi.encodePacked(header, message));
        return ecrecover(check, v, r, s);
    }
}
```

Script:
```
async function signature() {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a message to be signed:\n", async (answer) => {
    const signedMessage = await signer.signMessage(answer);
    console.log(`The signed message is:\n${signedMessage}`);
    rl.close();
    testSignature();
  });
}

async function testSignature() {
  console.log("Verifying signature\n");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter message signature:\n", (signature) => {
    rl.question("Enter message:\n", (message) => {
      const address = ethers.utils.verifyMessage(message, signature);
      console.log(`This message signature matches with address ${address}`);
      rl.question("Repeat? [Y/N]:\n", (answer) => {
        rl.close();
        if (answer.toLowerCase() === "y") {
          testSignature();
        }
      });
    });
  });
}

async function sealedSeed() {
  console.log("Deploying contract");
  const contractFactory = await ethers.getContractFactory("PseudoRandom");
  const contract: PseudoRandom = await contractFactory.deploy();
  await contract.deployed();
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a random seed to be signed:\n", async (seed) => {
    const signedMessage = await signer.signMessage(seed);
    rl.close();
    console.log(`The signed message is:\n${signedMessage}`);
    const sig = ethers.utils.splitSignature(signedMessage);
    console.log("Saving signature at contract");
    await contract.setSignature(sig.v, sig.r, sig.s);
    try {
      console.log("Trying to get a number with the original seed");
      const randomNumber = await contract.getRandomNumber(seed);
      console.log(`Random number result:\n${randomNumber}`);
      console.log("Trying to get a number without the original seed");
      const fakeSeed = "FAKE_SEED";
      const randomNumber2 = await contract.getRandomNumber(fakeSeed);
      console.log(`Random number result:\n${randomNumber2}`);
    } catch (error) {
      console.log("Operation failed");
    }
  });
}

async function randomSealedSeed() {
  console.log("Deploying contract");
  const contractFactory = await ethers.getContractFactory("PseudoRandom");
  const contract: PseudoRandom = await contractFactory.deploy();
  await contract.deployed();
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a random seed to be signed:\n", async (seed) => {
    const signedMessage = await signer.signMessage(seed);
    rl.close();
    console.log(`The signed message is:\n${signedMessage}`);
    const sig = ethers.utils.splitSignature(signedMessage);
    console.log("Saving signature at contract");
    await contract.setSignature(sig.v, sig.r, sig.s);
    try {
      console.log("Trying to get a number with the original seed");
      const randomNumber = await contract.getCombinedRandomNumber(seed);
      console.log(`Random number result:\n${randomNumber}`);
      console.log("Trying to get a number without the original seed");
      const fakeSeed = "FAKE_SEED";
      const randomNumber2 = await contract.getCombinedRandomNumber(fakeSeed);
      console.log(`Random number result:\n${randomNumber2}`);
    } catch (error) {
      console.log("Operation failed");
    }
  });
}
```
### References
https://docs.ethers.io/v5/api/signer/#Signer-signMessage

https://docs.ethers.io/v5/api/utils/signing-key/#utils-verifyMessage

https://blockchain-academy.hs-mittweida.de/courses/solidity-coding-beginners-to-intermediate/lessons/solidity-11-coding-patterns/topic/commit-reveal/

## Using RANDAO seed
* Block consensus info
* Beacon chain data

### Code references
Random.sol:
```
contract Random {
    function getRandomNumber()
        public
        view
        returns (uint256 randomNumber)
    {
        // TODO: get randomness from previous block randao reveal
    }

    function tossCoin() public view returns (bool heads) {
        // TODO: make the random number be translated to a boolean
    }
}
```

Scripts:
```
async function randao() {
  const contractFactory = await ethers.getContractFactory("Random");
  contractFactory.deploy().then(async (result) => {
    result.deployed().then(async (contract: Random) => {
      const currentBlock = await ethers.provider.getBlock("latest");
      const randomNumber = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock.number}\nBlock difficulty: ${currentBlock.difficulty}\nRandom number from this block difficulty: ${randomNumber}`
      );
      await ethers.provider.send("evm_mine", [currentBlock.timestamp + 1]);
      const currentBlock2 = await ethers.provider.getBlock("latest");
      const randomNumber2 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock2.number}\nBlock difficulty: ${currentBlock2.difficulty}\nRandom number from this block difficulty: ${randomNumber2}`
      );
      await ethers.provider.send("evm_mine", [currentBlock2.timestamp + 1]);
      const currentBlock3 = await ethers.provider.getBlock("latest");
      const randomNumber3 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock3.number}\nBlock difficulty: ${currentBlock3.difficulty}\nRandom number from this block difficulty: ${randomNumber3}`
      );
      await ethers.provider.send("evm_mine", [currentBlock3.timestamp + 1]);
      const currentBlock4 = await ethers.provider.getBlock("latest");
      const randomNumber4 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock4.number}\nBlock difficulty: ${currentBlock4.difficulty}\nRandom number from this block difficulty: ${randomNumber4}`
      );
      await ethers.provider.send("evm_mine", [currentBlock4.timestamp + 1]);
      const currentBlock5 = await ethers.provider.getBlock("latest");
      const randomNumber5 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock5.number}\nBlock difficulty: ${currentBlock5.difficulty}\nRandom number from this block difficulty: ${randomNumber5}`
      );
    });
  });
}
```

HardhatUserConfig.ts:
```
  networks: {
    hardhat: {
      hardfork: "merge"
    }
  },
```

### References
https://eips.ethereum.org/EIPS/eip-4399

https://github.com/ethereum/solidity/issues/13512

https://github.com/randao/randao

https://github.com/NomicFoundation/hardhat/releases/tag/hardhat%402.11.0
## Theory: Other randomness sources
* Bias in decentralized randomness generation
* Oracles
* Data sources
* Oracle patterns
* On-chain data
* VRF
### References

https://fravoll.github.io/solidity-patterns/oracle.html

https://betterprogramming.pub/how-to-generate-truly-random-numbers-in-solidity-and-blockchain-9ced6472dbdf

https://docs.chain.link/docs/chainlink-vrf/

## Bonus: organizing the script

```
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    "Select operation: \n Options: \n [1]: Random from block hash \n [2]: Toss a coin \n [3]: Message signature \n [4]: Random from a sealed seed \n [5]: Random from block hash plus a sealed seed \n [6]: Random from randao \n",
    (answer) => {
      console.log(`Selected: ${answer}`);
      const option = Number(answer);
      switch (option) {
        case 1:
          blockHashRandomness();
          break;
        case 2:
          tossCoin();
          break;
        case 3:
          signature();
          break;
        case 4:
          sealedSeed();
          break;
        case 5:
          randomSealedSeed();
          break;
        case 6:
          randao();
          break;
        default:
          console.log("Invalid");
          break;
      }
      rl.close();
    }
  );
}

...

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

# Homework
* Create Github Issues with your questions about this lesson
* Read the references