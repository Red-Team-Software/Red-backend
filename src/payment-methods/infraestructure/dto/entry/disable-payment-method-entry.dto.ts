import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";


export class DisablePaymentMethodInfraestructureRequestDTO{

    @ApiProperty( { required: true, default: '2128865d-15af-4e61-a6f9-062ff3881e22' })
    @IsString()
    @MinLength( 3 )
    id_payment_method: string;

}