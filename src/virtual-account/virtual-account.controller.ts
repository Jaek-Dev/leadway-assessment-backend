import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';
import { CreateVirtualAccountDto } from './dto/create-virtual-account.dto';
import { UpdateVirtualAccountDto } from './dto/update-virtual-account.dto';

@Controller('virtual-account')
export class VirtualAccountController {
  constructor(private readonly virtualAccountService: VirtualAccountService) {}

  @Post()
  create(@Body() createVirtualAccountDto: CreateVirtualAccountDto) {
    return this.virtualAccountService.create(createVirtualAccountDto);
  }

  @Get()
  findAll() {
    return this.virtualAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.virtualAccountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVirtualAccountDto: UpdateVirtualAccountDto) {
    return this.virtualAccountService.update(+id, updateVirtualAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.virtualAccountService.remove(+id);
  }
}
