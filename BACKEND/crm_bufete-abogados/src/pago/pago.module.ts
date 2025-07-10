import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PagoController } from './pago.controller';
import { PagoService } from './pago.service';

@Module({
  imports: [PrismaModule],
  controllers: [PagoController],
  providers: [PagoService],
})
export class PagoModule {}
