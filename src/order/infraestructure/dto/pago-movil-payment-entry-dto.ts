import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsIn, IsString } from "class-validator";
import { PaymentEntryDto } from "./payment-entry-dto";

export class PagoMovilPaymentEntryDto extends PaymentEntryDto{

  @ApiProperty({
    example: 'mercantil',
    description: 'mercantil, provincial, banesco',
  })
  @IsIn(['mercantil', 'provincial','banesco'])

  @IsString()
  bank: string;

  @ApiProperty({
    example: '0025519197010',
    description: 'The reference number to the payment',
  })
  @IsString()
  refNumber: string;

  @ApiProperty({
    example: '0025519197010',
    description: 'The reference of the moment of the payment',
  })
  @IsDateString()
  sendDate: Date;

  @ApiProperty({ example: 'V-29123456', description: 'The method of payment used' })
  @IsString()
  ciNumber: string;


}
