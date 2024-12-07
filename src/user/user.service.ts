import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { VirtualAccount } from 'src/virtual-account/entities/virtual-account.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(VirtualAccount)
    private virtualAccountRepository: Repository<VirtualAccount>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { emailAddress, phoneNumber } = createUserDto;

    const existingEmail = await this.userRepository.findOne({
      where: { emailAddress },
    });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingPhone = await this.userRepository.findOne({
      where: { phoneNumber },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already in use');
    }

    const lastVirtualAccount = await this.virtualAccountRepository
      .find({ order: { id: 'desc' }, take: 1 })
      .then((vas) => vas[0]);
    const accountNumber = String(
      Number(lastVirtualAccount?.accountNumber || '0') + 1,
    );

    const password = await hash(createUserDto.password, await genSalt());
    const user = this.userRepository.create({ ...createUserDto, password });
    const account = new VirtualAccount();
    account.accountNumber = accountNumber.padStart(10, '0');
    account.user = user;

    return this.virtualAccountRepository.save(account);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ emailAddress: email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
