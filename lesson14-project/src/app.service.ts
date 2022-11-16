import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

export class CreatePaymentOrderDTO {
  value: number;
  secret: string;
}

export class RequestPaymentOrderDTO {
  id: number;
  secret: string;
  receiver: string;
}

export class PaymentOrder {
  value: number;
  id: number;
  secret: string;
}

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  erc20ContractFactory: ethers.ContractFactory;
  paymentOrders: PaymentOrder[];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    );
    this.paymentOrders = [];
  }

  getBlock(hashOrTag = 'latest'): Promise<ethers.providers.Block> {
    return this.provider.getBlock(hashOrTag);
  }

  async getTotalSupply(address: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory
      .attach(address)
      .connect(this.provider);
    const totalSupply = await contractInstance.totalSupply();
    return parseFloat(ethers.utils.formatEther(totalSupply));
  }

  async getAllowance(
    contractAddress: string,
    from: string,
    to: string,
  ): Promise<number> {
    const contractInstance = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(this.provider);
    const allowance = await contractInstance.allowance(from, to);
    return parseFloat(ethers.utils.formatEther(allowance));
  }

  getPaymentOrder(id): any {
    return {
      value: this.paymentOrders[id].value,
      id: this.paymentOrders[id].id,
    };
  }

  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrders.length;
    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  async requestPaymentOrder(id: number, secret: string, receiver: string) {
    const paymentOrder = this.paymentOrders[id];
    if (secret != paymentOrder.secret) throw new Error('WRONG SECRET');
    const signer = ethers.Wallet.createRandom().connect(this.provider);
    // this should be an address from your .env
    // you should put a key or seed in your .env that is minter at that contract
    // for using .env in nest look here: https://docs.nestjs.com/techniques/configuration
    const contractInstance = this.erc20ContractFactory
      .attach('address in your .env file')
      .connect(signer);
    const tx = await contractInstance.mint(receiver, paymentOrder.value);
    return tx.wait();
  }
}
