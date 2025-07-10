import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RentaController } from './renta.controller';
import { RentaService } from './renta.service';

@Module({
  imports: [PrismaModule],
  controllers: [RentaController],
  providers: [RentaService],
})
export class RentaModule {}
