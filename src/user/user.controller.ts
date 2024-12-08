import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { VirtualAccountService } from 'src/virtual-account/virtual-account.service';
import { User } from './entities/user.entity';
import { VirtualAccount } from 'src/virtual-account/entities/virtual-account.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: VirtualAccountService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async profile(@Req() request: Request) {
    const account = (await this.accountService.findUserAccount(
      request.user as User,
    )) as VirtualAccount;
    return { ...request.user, balance: account.balance };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
