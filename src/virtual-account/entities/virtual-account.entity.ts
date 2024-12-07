import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class VirtualAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountNumber: string;

  @Column({ default: 0 })
  balance: number;

  @OneToOne(() => User, (user) => user.account, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  @JoinColumn()
  transactions: Transaction[];
}
