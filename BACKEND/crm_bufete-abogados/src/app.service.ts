import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Amor de mi vida te amo con todo mi corazon!';
  }
}
