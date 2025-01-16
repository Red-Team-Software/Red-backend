import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, IsNotEmpty, IsString, MinLength, IsBoolean, IsNumber, IsOptional } from "class-validator"

export class UserDirectionsInfraestructureRequestDTO {

    @ApiProperty( { required: true, default: 'casa' })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name:string

    @ApiProperty( { required: false, default: 'Avenida tejeran' })
    @IsString()
    @IsOptional()
    direction:string
    
    @ApiProperty( { required: true, default: true })
    @IsBoolean()
    favorite:boolean
    
    @ApiProperty( { required: true, default:38.8951 })
    @IsString()
    lat:string

    @ApiProperty( { required: true, default:-77.0364 })
    @IsString()
    long:string
}