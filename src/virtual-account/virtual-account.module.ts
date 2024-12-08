import { Module } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';
import { VirtualAccountController } from './virtual-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualAccount } from './entities/virtual-account.entity';

@Module({
  controllers: [VirtualAccountController],
  providers: [VirtualAccountService],
  imports: [TypeOrmModule.forFeature([VirtualAccount])],
})
export class VirtualAccountModule {}
