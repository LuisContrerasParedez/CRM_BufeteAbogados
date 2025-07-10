import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

@Injectable()
export class CuentaService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCuentaDto) {
    return this.prisma.cuenta.create({ data });
  }

  findAll() {
    return this.prisma.cuenta.findMany({
      include: { cliente: true, pagos: true, contratoRenta: true },
    });
  }

  findOne(id: number) {
    return this.prisma.cuenta.findUnique({
      where: { id },
      include: { cliente: true, pagos: true, contratoRenta: true },
    });
  }

  update(id: number, data: UpdateCuentaDto) {
    return this.prisma.cuenta.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.cuenta.delete({ where: { id } });
  }
}
