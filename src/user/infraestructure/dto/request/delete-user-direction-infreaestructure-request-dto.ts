import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
import { ByIdDTO } from 'src/common/infraestructure/dto/entry/by-id.dto';

export class DeleteUserDirectionsInfraestructureRequestDTO {
    @IsArray() 
    @ArrayNotEmpty() 
    @ValidateNested({ each: true })
    @Type(() => ByIdDTO)
    @ApiProperty({
        description: 'Delete User direction',
        example: [{
            id:'65302e02-69e4-4c6a-9096-2ce00427d498',
        }],
      })
    directions:ByIdDTO[]
}