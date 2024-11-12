import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentEntryDto {
  @ApiProperty({ example: 100, description: 'The amount to be paid' })
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  amount: number;

  @ApiProperty({
    example: 'USD',
    description: 'The currency in which the payment is made',
  })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'card', description: 'The method of payment used' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 'pm_card_threeDSecureOptional', description: 'The token that stripe gives' })
  @IsString()
  stripePaymentMethod: string;

  @ApiProperty({
    example: 40.7128,
    description: 'Latitude coordinate for the location',
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    example: -74.006,
    description: 'Longitude coordinate for the location',
  })
  @IsNumber()
  long: number;
}
