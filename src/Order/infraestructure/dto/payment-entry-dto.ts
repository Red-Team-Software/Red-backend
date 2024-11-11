import { Transform } from "class-transformer";
import { IsNumber, IsPositive, IsString } from "class-validator";


export class PaymentEntryDto {

    @IsNumber()
    @IsPositive()
    @Transform(({ value }) =>{
        return Number(value)
    })
    amount: number;

    @IsString()
    currency: string;

    @IsString()
    paymentMethod: string;

    @IsNumber()
    lat: number;

    @IsNumber()
    long: number;
}