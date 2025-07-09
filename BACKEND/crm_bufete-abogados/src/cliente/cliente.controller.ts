import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    try {
      return await this.clienteService.create(createClienteDto);
    } catch (error) {
      throw new HttpException('Error al crear cliente', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.clienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cliente = await this.clienteService.findOne(+id);
    if (!cliente) {
      throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
    }
    return cliente;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return await this.clienteService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.clienteService.remove(+id);
  }
}
