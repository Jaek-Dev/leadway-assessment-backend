import { Module } from '@nestjs/common';
import { VirtualAccountService } from './virtual-account.service';
import { VirtualAccountController } from './virtual-account.controller';

@Module({
  controllers: [VirtualAccountController],
  providers: [VirtualAccountService],
})
export class VirtualAccountModule {}
