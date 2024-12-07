import { VirtualAccount } from 'src/virtual-account/entities/virtual-account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const TRANSACTION_TYPE = {
  Debit: 'Debit',
  Credit: 'Credit',
  TopUp: 'Top Up',
};

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TRANSACTION_TYPE })
  type: string;

  @ManyToOne(() => VirtualAccount, { cascade: true, nullable: false })
  @JoinColumn()
  senderAccount: VirtualAccount;

  @ManyToOne(() => VirtualAccount, { cascade: true, nullable: false })
  @JoinColumn()
  receiverAccount: VirtualAccount;

  @Column()
  amount: number;

  @Column({ default: new Date() })
  createdAt: Date;
}
