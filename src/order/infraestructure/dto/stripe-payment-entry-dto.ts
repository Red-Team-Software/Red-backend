import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StripePaymentEntryDto {

  @ApiProperty({
    example: 'To be decided',
    description: 'The payment Method Id to know if it is active or inactive',
  })
  @IsString()
  paymentId: string;

  @ApiProperty({
    example: 'USD',
    description: 'The currency in which the payment is made, only use USD, EUR or BSF',
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
    example: 'Avenida Principal Alto Prado, Edificio Alto Prado Plaza',
    description: 'The address of the location',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'The bundles with their ids and quantities',
    example: [{ id: 'ad5c1b9f-9e35-4e8d-8531-8452d5b8b6fe', quantity: 5 }],
    required: false,
  })
  @IsArray()
  bundles? :{
    id: string,
    quantity: number
  }[];

  @ApiProperty({
    description: 'The products with their ids and quantities',
    example: [{ id: 'b38b2496-1c3e-42a2-9b36-bd1cf21234ab', quantity: 5 }],
    required: false,
  })
  @IsArray()
  products? :{
    id: string,
    quantity: number
  }[];

}
