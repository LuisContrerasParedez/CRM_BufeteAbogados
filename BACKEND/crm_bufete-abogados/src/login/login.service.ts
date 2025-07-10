import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validarUsuario(nombre: string, contrasena: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { nombre, activo: true },
    });

    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) throw new UnauthorizedException('Contraseña incorrecta');

    return usuario;
  }

  async login(dto: CreateLoginDto) {
    const usuario = await this.validarUsuario(dto.nombre, dto.contrasena);

    const payload = { sub: usuario.id, nombre: usuario.nombre };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
      },
    };
  }
}
