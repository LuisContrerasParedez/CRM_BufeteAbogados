import { PagoTipo } from '@prisma/client';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreatePagoDto {
  @IsNumber()
  @IsPositive()
  cuentaId: number;

  @IsEnum(PagoTipo)
  tipo: PagoTipo;

  @IsDecimal()
  monto: number;

  @IsOptional()
  @IsNumber()
  saldoPendiente?: number;

  @IsOptional()
  @IsNumber()
  CantMeses?: number;

  @IsOptional()
  @IsNumber()
  rentaId?: number;
}
