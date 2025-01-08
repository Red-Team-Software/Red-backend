import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MinLength, IsBase64, IsOptional, ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class CreateCategoryInfrastructureRequestDTO {
    @ApiProperty({ required: true, default: 'Vegetables' })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({ example: '["2c6c1571-deae-4a8a-a359-7fc8cc37a55b","de23a438-b272-42fc-b316-c8f2165cb0fd"]' })
    @IsArray()
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
    @IsUUID('4', { each: true })
    products: string[];

    @ApiProperty({ example: '["2c6c1571-deae-4a8a-a359-7fc8cc37a78b","de23a438-b272-42fc-b316-c8f2165ac0af"]' })
    @IsArray()
    @IsOptional()
    @IsUUID('4', { each: true })
    @Transform(({ value }) => {
        if (!value) return [];
        if (typeof value === 'string') {
            try {
                // Si es un JSON array, parsearlo
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) return parsed;
                throw new Error();
            } catch {
                // Si no es JSON válido, asumir que es un único UUID
                return [value];
            }
        }
        return value; // Si ya es un array, devolverlo como está
    })
    bundles: string[]; 
}
