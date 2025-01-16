import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsBase64, IsOptional, ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class CreateCategoryInfrastructureRequestDTO {
    @ApiProperty({ required: true, default: 'Vegetables' })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({ example: '["2c6c1571-deae-4a8a-a359-7fc8cc37a55b","de23a438-b272-42fc-b316-c8f2165cb0fd"]' })
    @IsArray()
    @IsOptional()
    @IsUUID('4', { each: true })
    products: string[]; 

    @ApiProperty({ example: '["2c6c1571-deae-4a8a-a359-7fc8cc37a78b","de23a438-b272-42fc-b316-c8f2165ac0af"]' })
    @IsArray()
    @IsOptional()
    @IsUUID('4', { each: true })
    bundles: string[]; 
}
