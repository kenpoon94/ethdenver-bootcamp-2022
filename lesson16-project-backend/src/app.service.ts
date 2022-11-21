import { Injectable } from '@nestjs/common';
import { getSigner, tokenContract } from './utils/general';
import { ethers } from 'ethers';

export class MintDTO {
  amount: string;
  address: string;
}

@Injectable()
export class AppService {
  async mint(amount: string, address: string): Promise<boolean> {
    try {
      const mintTx = await tokenContract
        .connect(getSigner())
        .mint(address, ethers.utils.parseEther(amount));
      await mintTx.wait();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
