import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email address.' })
  @IsNotEmpty({ message: 'Email address is required.' })
  emailAddress: string;

  @IsPhoneNumber('NG', { message: 'Invalid phone number.' })
  @IsNotEmpty({ message: 'Phone number is required.' })
  phoneNumber: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must contain 1 uppercase, 1 lowercase, 1 number and 1 special symbol.',
    },
  )
  @IsByteLength(8, undefined, {
    message: 'Password must have a minimum of 8 characters.',
  })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
