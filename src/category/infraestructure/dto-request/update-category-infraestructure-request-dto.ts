import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MinLength, IsOptional, IsArray, ArrayNotEmpty } from "class-validator";

export class UpdateCategoryInfraestructureRequestDTO {

    @ApiProperty({ required: false, default: 'Verduras' })
    @IsString()
    @MinLength(3)
    @IsOptional()
    name: string;
    
    @ApiProperty({
        required: false,
        default: ['123e4567-e89b-12d3-a456-426614174000']
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
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
    products: string[];

    @ApiProperty({
        required: false,
        default: ['123e4567-e89b-12d3-a456-426614174001']
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
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
    bundles: string[];
}
