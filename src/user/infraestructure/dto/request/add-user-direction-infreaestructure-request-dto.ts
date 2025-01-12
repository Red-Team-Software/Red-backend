import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, MinLength, ValidateNested } from 'class-validator';
import { UserDirectionsInfraestructureRequestDTO } from './user-direction-infraestructure-request-dto';

export class AddUserDirectionsInfraestructureRequestDTO {
    @IsArray() 
    @ArrayNotEmpty() 
    @ValidateNested({ each: true })
    @Type(() => UserDirectionsInfraestructureRequestDTO)
    @ApiProperty({
        description: 'The products with their ids and quantities',
        example: [{ 
            name: 'casa',
            favorite: true,
            lat: 38.8951,
            long: -77.0364
        }],
      })
    directions:UserDirectionsInfraestructureRequestDTO[]
}