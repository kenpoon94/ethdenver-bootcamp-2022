import { Controller, Get, Param, Query, Body, Post } from '@nestjs/common';
import {
  AppService,
  CreatePaymentOrderDTO,
  RequestPaymentOrderDTO,
} from './app.service';
import { ethers } from 'ethers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('last-block')
  getLastBlock(): Promise<ethers.providers.Block> {
    return this.appService.getBlock();
  }

  @Get('block/:number')
  getBlock(@Param('hash') hash: string): Promise<ethers.providers.Block> {
    return this.appService.getBlock(hash);
  }

  @Get('total-supply/:address')
  getTotalSupply(@Param('address') address: string): Promise<number> {
    return this.appService.getTotalSupply(address);
  }

  @Get('allowance')
  getAllowance(
    @Query('address') address: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<number> {
    return this.appService.getAllowance(address, from, to);
  }

  @Get('payment-order/:id')
  getPaymentOrder(@Param('id') id: string): any {
    return this.appService.getPaymentOrder(id);
  }

  @Post('payment-order')
  createPaymentOrder(@Body() body: CreatePaymentOrderDTO): number {
    return this.appService.createPaymentOrder(body.value, body.secret);
  }

  @Post('request-payment')
  requestPaymentOrder(@Body() body: RequestPaymentOrderDTO): Promise<any> {
    return this.appService.requestPaymentOrder(
      body.id,
      body.secret,
      body.receiver,
    );
  }
}
