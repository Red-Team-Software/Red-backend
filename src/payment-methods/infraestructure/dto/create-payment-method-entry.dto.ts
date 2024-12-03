import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";


export class CreatePaymentMethodInfraestructureRequestDTO{

    @ApiProperty( { required: true, default: 'Stripe' })
    @IsString()
    @MinLength( 3 )
    name: string

}