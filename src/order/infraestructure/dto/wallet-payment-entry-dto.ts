import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletPaymentEntryDto {
  
  @ApiProperty({
    example: '2cc214ab-1e1e-4a22-9547-185b4a09df0a',
    description: 'The payment Method Id to know if it is active or inactive',
  })
  @IsString()
  @IsOptional()
  paymentId?: string;

  @ApiProperty({
    example: 'USD',
    description: 'The currency in which the payment is made, only use USD, EUR or BSF',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'card', description: 'The method of payment used' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    example: 'El id de la direccion que tenga el user',
    description: 'ad5c1b9f-9e35-4e8d-8531-8452d5b8b6fe',
  })
  @IsString()
  idUserDirection: string;

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
    example: [{ id: 'a08a040d-fa77-4122-84bb-84fa91391cd6', quantity: 5 }],
    required: false,
  })
  @IsArray()
  products? :{
    id: string,
    quantity: number
  }[];

  @ApiProperty({
    example: '2cc214ab-1e1e-4a22-9547-185b4a09df0a',
    description: 'cupon Id to apply to the payment',
  })
  @IsString()
  @IsOptional()
  cuponId?: string;

}
