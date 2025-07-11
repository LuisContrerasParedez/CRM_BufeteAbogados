import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PagoTipo } from '@prisma/client';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}

async create(dto: CreatePagoDto) {
  const {
    cuentaId,
    tipo,
    monto,
    CantMeses,
    saldoPendiente,
    rentaId,
    mesInicio,
    mesFin,
    Nota,
    fechaPago,
    fechaRegistro
  } = dto;

const data: any = {
  cuentaId,
  tipo,
  monto: monto.toString(),
  fechaRegistro: fechaRegistro ? new Date(fechaRegistro) : new Date(),
  fechaPago: fechaPago ? new Date(fechaPago) : new Date(), 
  Nota: Nota || '',
};


  // ─── INTERÉS ────────────────────────────────────
  if (tipo === PagoTipo.INTERES) {
    // validamos primero que NO sean undefined
    if (mesInicio === undefined || mesFin === undefined || CantMeses === undefined) {
      throw new BadRequestException(
        'Para INTERÉS debes enviar mesInicio, mesFin y CantMeses',
      );
    }

    // aquí TS sabe que mesInicio y mesFin son string
    data.mesInicio  = new Date(mesInicio);
    data.mesFin     = new Date(mesFin);
    data.CantMeses  = CantMeses;
  }

  // ─── ABONO A CAPITAL ───────────────────────────────
  if (tipo === PagoTipo.ABONO_CAPITAL) {
    if (saldoPendiente === undefined) {
      throw new BadRequestException(
        'Para ABONO A CAPITAL debes enviar saldoPendiente',
      );
    }

    data.saldoPendiente = saldoPendiente.toString();
  }

  // ─── PAGO DE RENTA ────────────────────────────────
  if (tipo === PagoTipo.PAGO_RENTA) {
    if (rentaId === undefined || fechaPago === undefined) {
      throw new BadRequestException(
        'Para PAGO_DE_RENTA debes enviar rentaId y Fecha de Pago',
      );
    }

    data.rentaId   = rentaId;
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

  async update(id: number, dto: UpdatePagoDto) {
    const {
      tipo,
      monto,
      saldoPendiente,
      CantMeses,
      rentaId,
      mesInicio,
      mesFin,
    } = dto;

    // (Opcional) vuelve a validar campos obligatorios si cambias el tipo
    if (tipo) {
      switch (tipo) {
        case PagoTipo.INTERES:
          if (!mesInicio || !mesFin || CantMeses === undefined) {
            throw new BadRequestException(
              'Para INTERÉS debes enviar mesInicio, mesFin y CantMeses',
            );
          }
          break;
        case PagoTipo.ABONO_CAPITAL:
          if (saldoPendiente === undefined) {
            throw new BadRequestException(
              'Para ABONO A CAPITAL debes enviar saldoPendiente',
            );
          }
          break;
        case PagoTipo.PAGO_RENTA:
          if (rentaId === undefined || CantMeses === undefined) {
            throw new BadRequestException(
              'Para PAGO_DE_RENTA debes enviar rentaId y CantMeses',
            );
          }
          break;
        default:
          throw new BadRequestException('Tipo de pago inválido');
      }
    }

    const data: any = {};
    if (monto !== undefined)        data.monto = monto.toString();
    if (saldoPendiente !== undefined) data.saldoPendiente = saldoPendiente.toString();
    if (CantMeses !== undefined)      data.CantMeses = CantMeses;
    if (rentaId !== undefined)        data.rentaId = rentaId;
    if (mesInicio)                    data.mesInicio = new Date(mesInicio);
    if (mesFin)                       data.mesFin = new Date(mesFin);

    return this.prisma.pago.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.pago.delete({ where: { id } });
  }
}
