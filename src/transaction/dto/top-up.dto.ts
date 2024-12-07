import { IsNotEmpty, IsNumber } from 'class-validator';

export class TopUpDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
