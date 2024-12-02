import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';


export class UserDirectionsInfraestructureRequestDTO {

    @ApiProperty({ required:true ,example: '65302e02-69e4-4c6a-9096-2ce00427d498' })
    @IsUUID()
    id: string

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
    lng:number
}

export class DeleteUserDirectionsInfraestructureRequestDTO {
    @IsArray() 
    @ArrayNotEmpty() 
    @ValidateNested({ each: true })
    @Type(() => UserDirectionsInfraestructureRequestDTO)
    @ApiProperty({
        description: 'Delete User direction',
        example: [{
            id:'65302e02-69e4-4c6a-9096-2ce00427d498',
            name: 'casa',
            favorite: true,
            lat: 38.8951,
            lng: -77.0364
        }],
      })
    directions:UserDirectionsInfraestructureRequestDTO[]
}