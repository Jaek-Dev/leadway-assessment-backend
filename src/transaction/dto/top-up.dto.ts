import { IsNotEmpty, IsNumber, Max } from 'class-validator';

export class TopUpDto {
  @IsNumber({}, { message: 'Amount must be a number.' })
  @IsNotEmpty({ message: 'Amount is required.' })
  @Max(500_000, {
    message: `Amount cannot exceed ${Intl.NumberFormat().format(500_000)}`,
  })
  amount: number;
}
