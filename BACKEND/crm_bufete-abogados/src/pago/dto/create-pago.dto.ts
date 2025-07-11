import { PagoTipo } from '@prisma/client';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsDateString,
  IsString,
} from 'class-validator';

export class CreatePagoDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  cuentaId: number;

  @IsEnum(PagoTipo)
  @IsNotEmpty()
  tipo: PagoTipo;

  @IsDecimal()
  @IsPositive()
  @IsNotEmpty()
  monto: number;

  // Solo para préstamo: saldo tras aplicar este pago
  @IsOptional()
  @IsDecimal()
  @IsPositive()
  saldoPendiente?: number;

  // Para INTERÉS o RENTA: número de meses cubiertos
  @IsOptional()
  @IsNumber()
  @IsPositive()
  CantMeses?: number;

  // Solo para RENTA: contrato de renta asociado
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rentaId?: number;

  @IsOptional()
  @IsString()
  @IsPositive()
  Nota?: string;

   @IsOptional()
  @IsDateString()
  mesInicio?: string; 

  @IsOptional()
  @IsDateString()
  fechaPago?: string; 

  @IsOptional()
  @IsDateString()
  fechaRegistro?: string;  

  @IsOptional()
  @IsDateString()
  mesFin?: string;
}
