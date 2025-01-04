import { ApiProperty } from '@nestjs/swagger';
import { PaymentEntryDto } from './payment-entry-dto';
import { IsString } from 'class-validator';

export class StripePaymentEntryDto extends PaymentEntryDto {

  @ApiProperty({ example: 'pm_card_threeDSecureOptional', description: 'The token that stripe gives' })
  @IsString()
  stripePaymentMethod: string;

}
