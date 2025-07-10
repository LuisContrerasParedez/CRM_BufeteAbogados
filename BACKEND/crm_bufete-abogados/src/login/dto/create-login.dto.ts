import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateLoginDto {
  @IsString()
  nombre: string;

  @IsString()
  @MinLength(6)
  contrasena: string;
}
