import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRentaDto } from './dto/create-renta.dto';
import { UpdateRentaDto } from './dto/update-renta.dto';

@Injectable()
export class RentaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRentaDto) {
    const { cuentaId, fechaInicio, montoMensual } = dto;
    return this.prisma.renta.create({
      data: {
        cuentaId,
        // Prisma espera Date|String DateTime para DateTime
        fechaInicio: new Date(fechaInicio),
        // Prisma.DecimalJsLike: convertimos number→string
        montoMensual: montoMensual.toString(),
      },
    });
  }

  findAll() {
    return this.prisma.renta.findMany({
      include: { cuenta: true, pagos: true },
    });
  }

  findOne(id: number) {
    return this.prisma.renta.findUnique({
      where: { id },
      include: { cuenta: true, pagos: true },
    });
  }

  async update(id: number, dto: UpdateRentaDto) {
    const data: any = {};
    if (dto.fechaInicio) data.fechaInicio = new Date(dto.fechaInicio);
    if (dto.montoMensual !== undefined) data.montoMensual = dto.montoMensual.toString();
    if (dto.cuentaId !== undefined) data.cuentaId = dto.cuentaId;

    return this.prisma.renta.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.renta.delete({ where: { id } });
  }
}
