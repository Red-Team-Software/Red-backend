import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsNumber, IsPositive, IsDate } from "class-validator"

export class UpdateWalletBalancePagoMovilInfraestructureRequestDTO{
    
    @ApiProperty( { required: true, default: '04121234567' })
    @IsString()
    phone: string;

    @ApiProperty( { required: true, default: '30246205' })
    @IsString()
    cedula: string;

    @ApiProperty( { required: true, default: 'mercantil' })
    @IsString()
    bank: string;

    @ApiProperty( { required: true, default: '30000' })
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
    @IsOptional()
    paymentId?: string;
}