import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
import { UserDirectionsInfraestructureRequestDTO } from './user-direction-infraestructure-request-dto';
import { UserDirectionsByIdInfraestructureRequestDTO } from './update-user-direction-infraestructure-request-dto';


export class UpdateUserDirectionsInfraestructureRequestDTO {
    @IsArray() 
    @ArrayNotEmpty() 
    @ValidateNested({ each: true })
    @Type(() => UserDirectionsByIdInfraestructureRequestDTO)
    @ApiProperty({
        description: 'Delete User direction',
        example: [{
            id:'65302e02-69e4-4c6a-9096-2ce00427d498',
            name: 'casa',
            favorite: true,
            lat: 38.8951,
            long: -77.0364
        }],
      })
    directions:UserDirectionsByIdInfraestructureRequestDTO[]
}