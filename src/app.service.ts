import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApi(): string {
    return 'Upwisy API Service is running';
  }
}
