import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MinLength, IsOptional, IsArray, ArrayNotEmpty } from "class-validator";

export class UpdateCategoryInfraestructureRequestDTO {

    @ApiProperty({ required: false, default: 'Verduras' })
    @IsString()
    @MinLength(3)
    @IsOptional()
    name: string;

    @ApiProperty({ required: false, default: 'Esta es una categoría de verduras frescas.' })
    @IsString()
    @MinLength(3)
    @IsOptional()
    description?: string;

    @ApiProperty({
        required: false,
        default: ['123e4567-e89b-12d3-a456-426614174000'],
        type: [String],
        description: "Array de IDs de productos asociados a la categoría",
    })
    @IsArray()
    @IsOptional()
    products?: string[];

    @ApiProperty({
        required: false,
        default: ['123e4567-e89b-12d3-a456-426614174001'],
        type: [String],
        description: "Array de IDs de bundles asociados a la categoría",
    })
    @IsArray()
    @IsOptional()
    bundles?: string[];
}
