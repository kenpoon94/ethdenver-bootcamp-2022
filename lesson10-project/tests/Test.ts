import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  MyERC20,
  MyERC20__factory,
  MyERC721,
  MyERC721__factory,
  TokenSale,
  TokenSale__factory,
} from "../typechain-types";

const RATIO = 1;

describe("NFT Shop", async () => {
  let accounts: SignerWithAddress[];
  let tokenSaleContract: TokenSale;
  let paymentTokenContract: MyERC20;
  let erc721Contract: MyERC721;
  let erc20ContractFactory: MyERC20__factory;
  let erc721ContractFactory: MyERC721__factory;
  let tokenSaleContractFactory: TokenSale__factory;

  beforeEach(async () => {
    [
      accounts,
      tokenSaleContractFactory,
      erc20ContractFactory,
      erc721ContractFactory,
    ] = await Promise.all([
      ethers.getSigners(),
      ethers.getContractFactory("TokenSale"),
      ethers.getContractFactory("MyERC20"),
      ethers.getContractFactory("MyERC721"),
    ]);

    paymentTokenContract = await erc20ContractFactory.deploy();
    tokenSaleContract = await tokenSaleContractFactory.deploy(
      RATIO,
      paymentTokenContract.address
    );
    erc721Contract = await erc721ContractFactory.deploy();

    await Promise.all([
      tokenSaleContract.deployed(),
      paymentTokenContract.deployed(),
      erc721Contract.deployed(),
    ]);

    const MINTER_ROLE = await paymentTokenContract.MINTER_ROLE();
    const roleTx = await paymentTokenContract.grantRole(
      MINTER_ROLE,
      tokenSaleContract.address
    );
    await roleTx.wait();
  });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      await tokenSaleContract.ratio().then((ratio: BigNumber) => {
        expect(ratio).to.be.eq(RATIO);
      });
    });

    it("uses a valid ERC20 as payment token", async () => {
      await tokenSaleContract.paymentToken().then(async (paymentAddress) => {
        const paymentContract = erc20ContractFactory.attach(paymentAddress);
        await expect(paymentContract.balanceOf(accounts[0].address)).not.to.be
          .reverted;
        await expect(paymentContract.totalSupply()).not.to.be.reverted;
      });
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    const buyValue = ethers.utils.parseEther("1");
    beforeEach(async () => {
      const tx = await tokenSaleContract
        .connect(accounts[1])
        .buyTokens({ value: buyValue });
      await tx.wait();
    });

    xit("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    xit("gives the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns an ERC20 at the Token contract", async () => {
    xit("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    xit("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user purchase a NFT from the Shop contract", async () => {
    xit("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    xit("updates the owner account correctly", async () => {
      throw new Error("Not implemented");
    });

    xit("update the pool account correctly", async () => {
      throw new Error("Not implemented");
    });

    xit("favors the pool with the rounding", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    xit("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    xit("updates the pool correctly", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraw from the Shop contract", async () => {
    xit("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    xit("updates the owner account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});
