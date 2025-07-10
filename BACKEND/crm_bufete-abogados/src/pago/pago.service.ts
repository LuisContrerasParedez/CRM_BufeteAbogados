import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePagoDto) {
    const { cuentaId, tipo, monto, CantMeses, saldoPendiente, rentaId } = dto;

    const data: any = {
      cuentaId,
      tipo,
      monto: monto.toString(),
    };

    if (saldoPendiente !== undefined) {
      data.saldoPendiente = saldoPendiente.toString();
    }

    if (rentaId !== undefined) {
      data.rentaId = rentaId;
      data.CantMeses = CantMeses; 
    }

    return this.prisma.pago.create({ data });
  }


  findAll() {
    return this.prisma.pago.findMany({
      include: { cuenta: true, renta: true },
    });
  }

  findOne(id: number) {
    return this.prisma.pago.findUnique({
      where: { id },
      include: { cuenta: true, renta: true },
    });
  }

  update(id: number, data: UpdatePagoDto) {
    return this.prisma.pago.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.pago.delete({ where: { id } });
  }
}
