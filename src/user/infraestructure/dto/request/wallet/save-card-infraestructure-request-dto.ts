import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class SaveCardInfraestructureRequestDTO{
    
    @ApiProperty( { required: true, default: 'pm_card_threeDSecureOptional' })
    @IsString()
    id: string;

}