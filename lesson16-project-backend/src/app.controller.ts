import { Body, Controller, Post } from '@nestjs/common';
import { AppService, MintDTO } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('mint')
  mint(@Body() body: MintDTO): Promise<boolean> {
    return this.appService.mint(body.amount ? body.amount : '10', body.address);
  }
}
