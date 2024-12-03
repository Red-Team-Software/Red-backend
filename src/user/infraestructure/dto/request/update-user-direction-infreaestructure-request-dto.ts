import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
import { UserDirectionsInfraestructureRequestDTO } from './user-direction-infraestructure-request-dto';


export class UpdateUserDirectionsInfraestructureRequestDTO {
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