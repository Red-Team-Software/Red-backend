import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UseCuponInfraestructureRequestDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The ID of the user using the coupon',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    userId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The code of the coupon being used',
        example: 'DISCOUNT2024',
    })
    cuponCode: string;
}
