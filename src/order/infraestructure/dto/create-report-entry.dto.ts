import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReportEntryDto {
    @ApiProperty({ example: '2128865d-15af-4e61-a6f9-062ff3881e22',description: 'payment id' })
    @IsString()
    orderId: string;

    @ApiProperty({
        example: 'La orden tardo mucho',
        description: 'description of the report',
    })
    @IsString()
    description: string;
}