import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, IsNotEmpty, IsString, MinLength, IsBoolean, IsNumber } from "class-validator"

export class UserDirectionsInfraestructureRequestDTO {

    @ApiProperty( { required: true, default: 'casa' })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name:string
    
    @ApiProperty( { required: true, default: true })
    @IsBoolean()
    favorite:boolean

    @ApiProperty( { required: true, default:38.8951 })
    @IsNumber()
    lat:number

    @ApiProperty( { required: true, default:-77.0364 })
    @IsNumber()
    long:number
}