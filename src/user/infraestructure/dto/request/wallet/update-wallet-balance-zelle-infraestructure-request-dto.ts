import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsNumber, IsPositive, IsDate, IsEmail } from "class-validator"

export class UpdateWalletBalanceZelleInfraestructureRequestDTO{
    
    @ApiProperty( { required: true, default: '04121234567' })
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
    
}