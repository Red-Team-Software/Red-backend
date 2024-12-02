import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber } from 'class-validator';


export class UserDirectionsInfraestructureRequestDTO {

    @ApiProperty( { required: true, default: 'casa' })

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

export class AddUserDirectionsInfraestructureRequestDTO {
    @IsArray()
    @ApiProperty({
        description: 'The products with their ids and quantities',
        example: [{ 
            name: 'casa',
            favorite: true,
            lat: 38.8951,
            lng: -77.0364
        }],
      })
    directions:UserDirectionsInfraestructureRequestDTO[]
}