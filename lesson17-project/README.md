# Lesson 17 - Introduction to gas optimization and smart contract security

## Gas optimization

- (Review) Gas costs
- (Review) Read and write operations
- (Review) Storage, memory and stack
- Compiler optimizer
- Converting state reads to local reads
- Converting multiple state writes to multiple local writes and single state write
- Packing Structs

### Code References

Contract:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Gas {
    uint256 public highScore;

    function loopActions(uint256 actions) public {
        while (actions > 1) {
            highScore += actions / (1 + highScore);
            actions--;
        }
    }

    uint256 highestNumber1;

    function updateNumber(uint256 countValue) public {
        while (countValue > highestNumber1) {
            countValue--;
            highestNumber1++;
        }
    }

    uint256 highestNumber2;

    function updateNumberOptimized(uint256 countValue) public {
        // TODO
    }

    struct Packed {
        uint256 a;
        uint128 b;
        uint128 c;
        uint64 d;
        uint64 e;
        uint64 f;
        uint32 g;
        uint8 h;
        uint8 i;
        uint8 j;
        uint8 k;
    }

    struct Unpacked {
        uint128 b;
        uint8 h;
        uint64 d;
        uint8 k;
        uint256 a;
        uint64 e;
        uint128 c;
        uint8 j;
        uint64 f;
        uint8 i;
        uint32 g;
    }

    Packed[] packedObjectsArray;

    Unpacked[] unpackedObjectsArray;

    function createPacked() public {
        packedObjectsArray.push(
            Packed({
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                e: 0,
                f: 0,
                g: 0,
                h: 0,
                i: 0,
                j: 0,
                k: 0
            })
        );
    }

    function createUnpacked() public {
        unpackedObjectsArray.push(
            Unpacked({
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                e: 0,
                f: 0,
                g: 0,
                h: 0,
                i: 0,
                j: 0,
                k: 0
            })
        );
    }
}
```

Comparing compiler options:

```
import config from "../hardhat.config";

...

async function compareDeploy() {
  const userSettings = config?.solidity as any;
  console.log(
    `Using ${userSettings.settings?.optimizer.runs} runs optimization`
  );
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const deployTxReceipt = await contract.deployTransaction.wait();
  console.log(`Used ${deployTxReceipt.gasUsed} gas units in deployment`);
  const testTx = await contract.loopActions(TEST_VALUE);
  const testTxReceipt = await testTx.wait();
  console.log(`Used ${testTxReceipt.gasUsed} gas units in test function`);
}
```

Comparing locations:

```
async function compareLocations() {
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const testTx1 = await contract.updateNumber(TEST2_VALUE);
  const testTx1Receipt = await testTx1.wait();
  console.log(
    `Used ${testTx1Receipt.gasUsed} gas units in storage and local reads test function`
  );
  const testTx2 = await contract.updateNumberOptimized(TEST2_VALUE);
  const testTx2Receipt = await testTx2.wait();
  console.log(
    `Used ${testTx2Receipt.gasUsed} gas units in optimized state and local reads test function`
  );
}
```

Compare packing:

```
async function comparePacking() {
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const testTx1 = await contract.createUnpacked();
  const testTx1Receipt = await testTx1.wait();
  console.log(
    `Used ${testTx1Receipt.gasUsed} gas units in struct packing test function`
  );
  const testTx2 = await contract.createPacked();
  const testTx2Receipt = await testTx2.wait();
  console.log(
    `Used ${testTx2Receipt.gasUsed} gas units in optimized struct packing test function`
  );
}
```

### References

https://hardhat.org/guides/compile-contracts.html#configuring-the-compiler

https://eip2535diamonds.substack.com/p/smart-contract-gas-optimization-with

https://github.com/iskdrews/awesome-solidity-gas-optimization

## Positive and negative overflow and underflow

- The age of SafeMath
- Solidity 0.8.0
- Using overflow without reverting
  - Valid use cases for overflow
  - Command blocks inside solidity
  - Using “Unchecked” block
- Misconceptions about underflow

### Code references

Contract:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract OverflowTest {
    uint8 public counter;

    function increment(uint8 amount) public {
        counter += amount;
    }

    function forceIncrement(uint8 amount) public {
        unchecked {
            counter += amount;
        }
    }
}

```

Unit tests:

```
const SAFE_INCREMENT = 99;
const UNSAFE_INCREMENT = 199;

if (SAFE_INCREMENT + UNSAFE_INCREMENT <= 2 ** 8)
  throw new Error("Test not properly configured");

describe("Testing Overflow operations", async () => {
  let testContract: OverflowTest;

  beforeEach(async () => {
    const testContractFactory = await ethers.getContractFactory("OverflowTest");
    testContract = await testContractFactory.deploy();
    await testContract.deployed();
    const tx = await testContract.increment(SAFE_INCREMENT);
    await tx.wait();
  });

  describe("When incrementing under safe circumstances", async () => {
    it("increments correctly", async () => {
      // TODO
    });
  });
  describe("When incrementing to overflow", async () => {
    it("reverts", async () => {
      // TODO
    });
  });
  describe("When incrementing to overflow within a unchecked block", async () => {
    it("overflows and increments", async () => {
      // TODO
    });
  });
});
```

### References

https://en.wikipedia.org/wiki/Integer_overflow

https://en.wikipedia.org/wiki/Arithmetic_underflow

https://docs.openzeppelin.com/contracts/4.x/api/utils#SafeMath

https://docs.soliditylang.org/en/latest/080-breaking-changes.html

https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic

## Smart contract security

- (Review) Payable and Fallbacks
- (Review) Attack vectors
- Self destruct
- (Review) External calls
- (Review) Inspecting transactions to reveal data
- (Review) Overflow and Underflow
- Exploiting architecture flaws
- Live examples
  - Ethernaut challenge 5
  - Ethernaut challenge 8
  - Ethernaut challenge 15

### References

https://ethereum-contract-security-techniques-and-tips.readthedocs.io/en/latest/known_attacks/

https://ethernaut.openzeppelin.com/

# Homework

- Create Github Issues with your questions about this lesson
- Read the references
- (Optional) Complete the security challenges from Ethernaut
- (Optional) Play and finish [Capture the Ether](https://capturetheether.com/challenges/)
