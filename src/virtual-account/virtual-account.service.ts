import { Injectable } from '@nestjs/common';
import { CreateVirtualAccountDto } from './dto/create-virtual-account.dto';
import { UpdateVirtualAccountDto } from './dto/update-virtual-account.dto';

@Injectable()
export class VirtualAccountService {
  create(createVirtualAccountDto: CreateVirtualAccountDto) {
    return 'This action adds a new virtualAccount';
  }

  findAll() {
    return `This action returns all virtualAccount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} virtualAccount`;
  }

  update(id: number, updateVirtualAccountDto: UpdateVirtualAccountDto) {
    return `This action updates a #${id} virtualAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} virtualAccount`;
  }
}
