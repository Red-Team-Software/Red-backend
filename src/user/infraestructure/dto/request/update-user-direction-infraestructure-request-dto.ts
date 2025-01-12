import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, IsNotEmpty, IsString, MinLength, IsBoolean, IsNumber } from "class-validator"
import { ByIdDTO } from "src/common/infraestructure/dto/entry/by-id.dto"

export class UserDirectionsByIdInfraestructureRequestDTO extends ByIdDTO {

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