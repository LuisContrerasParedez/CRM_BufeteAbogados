import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    return await this.prisma.cliente.create({ data });
  }

  async findAll() {
    return await this.prisma.cliente.findMany({
      orderBy: {
        fecha_registro: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.cliente.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateClienteDto) {
    return await this.prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.cliente.delete({
      where: { id },
    });
  }
}
