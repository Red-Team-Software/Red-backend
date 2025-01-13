import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, IsNotEmpty, IsString, MinLength, IsBoolean, IsNumber } from "class-validator"
import { UserDirectionsInfraestructureRequestDTO } from "./user-direction-infraestructure-request-dto"

export class UserDirectionsByIdInfraestructureRequestDTO extends UserDirectionsInfraestructureRequestDTO{

    @ApiProperty( { required: true, default: '94bfc16a-0757-45f5-a326-6dceac87b8fd' })
    @IsString()
    @IsUUID()
    directionId:string

}