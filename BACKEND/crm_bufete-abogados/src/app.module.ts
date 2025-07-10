import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClienteModule } from './cliente/cliente.module';
import { LoginModule } from './login/login.module';
import { UsuarioModule } from './usuario/usuario.module';
import { CuentaModule } from './cuenta/cuenta.module';
import { PagoModule } from './pago/pago.module';
import { RentaModule } from './renta/renta.module';

@Module({
  imports: [PrismaModule, ClienteModule, LoginModule, UsuarioModule, CuentaModule, PagoModule, RentaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
