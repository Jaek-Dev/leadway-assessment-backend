import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { VirtualAccount } from './entities/virtual-account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VirtualAccountService {
  constructor(
    @InjectRepository(VirtualAccount)
    private readonly accountRepository: Repository<VirtualAccount>,
  ) {}

  findUserAccount(user: User) {
    return this.accountRepository.findOneBy({
      user: { id: user.id },
    });
  }
}
