import { Injectable } from '@nestjs/common';
import { getSigner } from './utils/general';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getSigner(): string {
    console.log('Hello', getSigner());
    return 'Test';
  }
}
