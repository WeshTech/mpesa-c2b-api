import {
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
  Matches,
  Max,
  IsInt,
} from 'class-validator';

export class SimulatePaymentDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(1, { message: 'Amount must be at least 1' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^254[0-9]{9}$/, {
    message: 'Phone must be start with 7',
  })
  phone: string;

  @IsInt({ message: 'Account number must be an integer' })
  @Min(1, { message: 'Account number must be at least 1' })
  @Max(99999, { message: 'Account number cannot exceed 5 digits' })
  @IsNotEmpty({ message: 'Account number is required' })
  accountNumber: number;
}
