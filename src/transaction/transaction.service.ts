import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TRANSACTION_TYPE } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { VirtualAccount } from 'src/virtual-account/entities/virtual-account.entity';
import { TopUpDto } from './dto/top-up.dto';
import { User } from 'src/user/entities/user.entity';
import { instanceToInstance } from 'class-transformer';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(VirtualAccount)
    private accountRepository: Repository<VirtualAccount>,

    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async transfer(user: User, createTransactionDto: CreateTransactionDto) {
    const fromAccount = await this.accountRepository.findOneBy({
      user: { id: user.id },
    });
    if (!fromAccount) {
      throw new HttpException(
        'Something went wrong!.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const account = await this.accountRepository.findOneBy({
      accountNumber: createTransactionDto.accountNumber,
    });
    if (!account) {
      throw new HttpException(
        'Account does not exist.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (fromAccount.accountNumber === account.accountNumber) {
      throw new HttpException(
        'You cannot transfer to yourself.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (
      fromAccount.balance < createTransactionDto.amount ||
      fromAccount.balance == 0
    ) {
      throw new HttpException(
        'Insufficient funds.',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    // Create the debit transaction
    const transaction = new Transaction();
    transaction.amount = createTransactionDto.amount;
    transaction.type = TRANSACTION_TYPE.Debit;
    transaction.senderAccount = fromAccount;
    transaction.receiverAccount = account;

    // Create the credit transaction
    // const credit = new Transaction();
    // credit.amount = createTransactionDto.amount;
    // credit.type = TRANSACTION_TYPE.Credit;
    // credit.senderAccount = fromAccount;
    // credit.receiverAccount = account;

    // Update balances
    fromAccount.balance -= createTransactionDto.amount;
    account.balance += createTransactionDto.amount;

    // Save changes using repositories
    await this.accountRepository.manager.transaction(async (entityManager) => {
      await entityManager.save(fromAccount);
      await entityManager.save(account);
      await entityManager.save(transaction);
    });
  }

  async topUp(user: User, dto: TopUpDto) {
    const account = await this.accountRepository.findOneBy({
      user: { id: user.id },
    });
    if (!account) {
      throw new HttpException(
        'Could not find your account.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (dto.amount < 100) {
      throw new HttpException(
        'Minimum top-up amount is 100.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Create the credit transaction
    const credit = new Transaction();
    credit.amount = dto.amount;
    credit.type = TRANSACTION_TYPE.TopUp;
    credit.senderAccount = account;
    credit.receiverAccount = account;
    account.balance += dto.amount;

    // Save changes using repositories
    await this.accountRepository.manager.transaction(async (entityManager) => {
      await entityManager.save(account);
      await entityManager.save(credit);
    });
  }

  async findMine(user: User) {
    return instanceToInstance(
      this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.senderAccount', 'senderAccount')
        .leftJoinAndSelect('transaction.receiverAccount', 'receiverAccount')
        .leftJoinAndSelect('senderAccount.user', 'senderUser')
        .leftJoinAndSelect('receiverAccount.user', 'receiverUser')
        .where('senderAccount.user.id = :userId', { userId: user.id })
        .orWhere('receiverAccount.user.id = :userId', { userId: user.id })
        .orderBy({ 'transaction.id': 'DESC' })
        .getMany(),
    );
  }

  findAll() {
    return this.transactionRepository.find();
  }

  findOne(id: number) {
    return this.accountRepository.findOneBy({ id });
  }
}
