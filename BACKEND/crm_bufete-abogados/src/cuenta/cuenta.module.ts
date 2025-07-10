// src/cuenta/cuenta.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';

@Module({
  imports: [PrismaModule],
  controllers: [CuentaController],
  providers: [CuentaService],
})
export class CuentaModule {}
