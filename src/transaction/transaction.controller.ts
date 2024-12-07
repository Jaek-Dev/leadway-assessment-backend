import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Request, Response } from 'express';
import { TopUpDto } from './dto/top-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transfer')
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    await this.transactionService.transfer(
      req.user as User,
      createTransactionDto,
    );
    res.status(HttpStatus.CREATED).send();
  }

  @Post('top-up')
  async topUp(
    @Body() dto: TopUpDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    await this.transactionService.topUp(req.user as User, dto);
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findMine(@Req() request: Request) {
    return this.transactionService.findMine(request.user as User);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
