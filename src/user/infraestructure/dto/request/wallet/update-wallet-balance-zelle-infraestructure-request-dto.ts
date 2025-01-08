import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsNumber, IsPositive, IsDate, IsEmail } from "class-validator"

export class UpdateWalletBalanceZelleInfraestructureRequestDTO{
    
    @ApiProperty( { required: true, default: 'gadeso2003@gmail.com' })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty( { required: true, default: '50' })
    @IsNumber()
    @IsPositive()
    amount: number;
    
    @ApiProperty( { required: true, default: '245618795445342588' })
    @IsString()
    reference: string;

    // @ApiProperty( { required: false, default: '22/03/2025' })
    // @IsDate()
    // @IsOptional()
    // date: Date;

    @ApiProperty({
        example: '2cc214ab-1e1e-4a22-9547-185b4a09df0a',
        description: 'The payment Method Id to know if it is active or inactive',
    })
    @IsString()
    paymentId: string;
    
}