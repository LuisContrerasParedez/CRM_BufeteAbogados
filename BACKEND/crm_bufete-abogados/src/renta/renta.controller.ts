import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RentaService } from './renta.service';
import { CreateRentaDto } from './dto/create-renta.dto';
import { UpdateRentaDto } from './dto/update-renta.dto';

@Controller('rentas')
export class RentaController {
  constructor(private readonly rentaService: RentaService) {}

  @Post()
  create(@Body() dto: CreateRentaDto) {
    return this.rentaService.create(dto);
  }

  @Get()
  findAll() {
    return this.rentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRentaDto,
  ) {
    return this.rentaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentaService.remove(id);
  }
}
