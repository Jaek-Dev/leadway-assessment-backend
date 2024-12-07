import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address.' })
  @IsNotEmpty({ message: 'Enter your email address.' })
  email: string;

  @IsNotEmpty({ message: 'Enter your password.' })
  password: string;
}
