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
