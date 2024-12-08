import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { VirtualAccount } from 'src/virtual-account/entities/virtual-account.entity';
import { VirtualAccountService } from 'src/virtual-account/virtual-account.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, VirtualAccount])],
  providers: [UserService, VirtualAccountService],
  exports: [UserService],
})
export class UserModule {}
