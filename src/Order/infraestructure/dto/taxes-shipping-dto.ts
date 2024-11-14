import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsPositive, IsString } from "class-validator";


export class TaxesShippingFeeEntryDto {

    @ApiProperty({ example: 100, description: 'The amount to be paid' })
    @IsNumber()
    @IsPositive()
    @Transform(({ value }) =>{
        return Number(value)
    })
    amount: number;

    @ApiProperty({ 
        example: 'USD',
        description: 'The currency in which the payment is made, only use USD, EUR or BSF' })
    @IsString()
    currency: string;
    
    @ApiProperty({
        example: 'Avenida Principal Alto Prado, Edificio Alto Prado Plaza',
        description: 'The address of the location',
    })
    @IsString()
    address: string;
}