import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefundPaymentDto {
  @ApiProperty({ description: 'payment id' })
  @IsString()
  paymentIntentId: string;

  @ApiProperty({
    description: 'payment method',
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 'pm_card_threeDSecureOptional', description: 'The token that stripe gives' })
  @IsString()
  stripePaymentMethod: string;
}


export interface OrderPayApplicationServiceRequestDto {
  paymentMethod: string;
  address: string;
  products?: {
      id: string,
      quantity: number
  }[];
  bundles?: {
      id: string,
      quantity: number
  }[];
}

export interface OrderPayStripeInfraestructureRequestDTO extends OrderPayApplicationServiceRequestDto{
  stripeId:string
}

export interface OrderPayPagoMovilInfraestructureRequestDTO extends OrderPayApplicationServiceRequestDto{
  cedula:string
  banco:string
  telefono:string
}