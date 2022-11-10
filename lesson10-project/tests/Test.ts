import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { text } from "stream/consumers";
import {
  MyERC20,
  MyERC20__factory,
  MyERC721,
  MyERC721__factory,
  TokenSale,
  TokenSale__factory,
} from "../typechain-types";

const RATIO = 5;
const NFT_PRICE = ethers.utils.parseEther("0.1");

describe("NFT Shop", async () => {
  let accounts: SignerWithAddress[];
  let tokenSaleContract: TokenSale;
  let paymentTokenContract: MyERC20;
  let nftContract: MyERC721;
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

    nftContract = await erc721ContractFactory.deploy();
    paymentTokenContract = await erc20ContractFactory.deploy();
    tokenSaleContract = await tokenSaleContractFactory.deploy(
      RATIO,
      NFT_PRICE,
      paymentTokenContract.address,
      nftContract.address
    );

    await Promise.all([
      tokenSaleContract.deployed(),
      paymentTokenContract.deployed(),
      nftContract.deployed(),
    ]);

    const MINTER_ROLE = await paymentTokenContract.MINTER_ROLE();
    const roleTx1 = await paymentTokenContract.grantRole(
      MINTER_ROLE,
      tokenSaleContract.address
    );
    await roleTx1.wait();
    const roleTx2 = await nftContract.grantRole(
      MINTER_ROLE,
      tokenSaleContract.address
    );
    await roleTx2.wait();
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
    let balanceBefore: BigNumber;
    let gasCosts: BigNumber;

    beforeEach(async () => {
      balanceBefore = await accounts[1].getBalance();
      const tx = await tokenSaleContract
        .connect(accounts[1])
        .buyTokens({ value: buyValue });
      const { gasUsed, effectiveGasPrice } = await tx.wait();
      gasCosts = gasUsed.mul(effectiveGasPrice);
    });

    it("charges the correct amount of ETH", async () => {
      await accounts[1].getBalance().then((balanceAfter) => {
        expect(balanceBefore.sub(balanceAfter)).to.eq(buyValue.add(gasCosts));
      });
    });

    it("gives the correct amount of tokens", async () => {
      await paymentTokenContract
        .balanceOf(accounts[1].address)
        .then((tokenBalance) => {
          expect(tokenBalance).to.be.eq(buyValue.div(RATIO));
        });
    });

    describe("When a user burns an ERC20 at the Token contract", async () => {
      beforeEach(async () => {
        const expectedBalance = buyValue.div(RATIO);
        const allowTx = await paymentTokenContract
          .connect(accounts[1])
          .approve(tokenSaleContract.address, expectedBalance);
        await allowTx.wait();
        const burnTx = await tokenSaleContract
          .connect(accounts[1])
          .returnTokens(expectedBalance);
        await burnTx.wait();
      });

      xit("gives the correct amount of ETH", async () => {});

      it("burns the correct amount of tokens", async () => {
        const balance = await paymentTokenContract.balanceOf(
          accounts[1].address
        );
        expect(balance).to.be.eq(0);
      });
    });
  });

  describe("When a user purchase a NFT from the Shop contract", async () => {
    beforeEach(async () => {
      const allowTx = await paymentTokenContract
        .connect(accounts[1])
        .approve(tokenSaleContract.address, NFT_PRICE);
      await allowTx.wait();
      const mintTx = await tokenSaleContract.connect(accounts[1]).buyNFT(0);
      await mintTx.wait();
    });
    xit("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    xit("updates the owner account correctly", async () => {
      const nftOwner = await nftContract.ownerOf(0);
      expect(nftOwner).to.be.eq(accounts[1].address);
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
