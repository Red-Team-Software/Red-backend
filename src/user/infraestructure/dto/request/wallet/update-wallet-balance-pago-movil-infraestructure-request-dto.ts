import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsNumber, IsPositive, IsDate } from "class-validator"

export class UpdateWalletBalancePagoMovilInfraestructureRequestDTO{
    
    @ApiProperty( { required: true, default: '04121234567' })
    @IsString()
    phone: string;

    @ApiProperty( { required: true, default: '30246205' })
    @IsString()
    cedula: string;

    @ApiProperty( { required: true, default: 'alfredo' })
    @IsString()
    bank: string;

    @ApiProperty( { required: true, default: '30000' })
    @IsNumber()
    @IsPositive()
    amount: number;
    
    @ApiProperty( { required: true, default: '245618795445342588' })
    @IsString()
    reference: string;

    @ApiProperty( { required: false, default: '22/03/2025' })
    @IsDate()
    @IsOptional()
    date?: Date;
}