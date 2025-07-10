import { CuentaTipo } from '@prisma/client';
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCuentaDto {
  @IsString()
  @IsNotEmpty()
  numeroEscritura: string;

  @IsEnum(CuentaTipo)
  tipo: CuentaTipo;

  @IsNumber()
  monto: number;

  @IsOptional()
  @IsNumber()
  interes?: number;

  @IsNumber()
  clienteId: number;
}
