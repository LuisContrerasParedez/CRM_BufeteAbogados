import { IsDateString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateRentaDto {
  @IsNumber()
  @IsPositive()
  cuentaId: number;

  @IsDateString()
  fechaInicio: string;   

  @IsNumber()
  @IsPositive()
  montoMensual: number;   
}
