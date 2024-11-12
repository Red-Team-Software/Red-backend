import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'payment id' })
  @IsString()
  paymentIntentId: string;

  @ApiProperty({
    description: 'payment method',
  })
  @IsString()
  paymentMethod: string;
}
