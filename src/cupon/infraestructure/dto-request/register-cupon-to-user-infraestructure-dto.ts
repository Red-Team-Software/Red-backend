import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RegisterCuponToUserInfraestructureRequestDTO {
    @ApiProperty({
        description: 'Array of user IDs associated with the coupon',
        example: ['1e94d755-837c-4c6a-8f7c-8c3bc8e7fdb5', '7c9e6679-7425-40de-944b-e07fc1f90ae7'],
    })
    @IsArray()
    @IsUUID('4', { each: true })
    @IsNotEmpty({ each: true })
    @Transform(({ value }) => {
            if (!value) return [];
            if (typeof value === 'string') {
                try {
                    // Si es un JSON array, parsearlo
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) return parsed;
                    throw new Error("Invalid JSON");
                } catch {
                    // Si no es JSON válido, asumir que es un único UUID
                    return [value];
                }
            }
            return value; // Si ya es un array, devolverlo como está
        })
    userIds: string[];

    @ApiProperty({
        description: 'Unique ID of the coupon',
        example: '1e94d755-837c-4c6a-8f7c-8c3bc8e7fdb5',
    })
    @IsUUID('4')
    @IsNotEmpty()
    cuponId: string;
}
