import { Controller } from '@nestjs/common';

@Controller()
export class AppController { 
  getApi(): string {
    return 'Upwisy API Service is running';
  }
}
