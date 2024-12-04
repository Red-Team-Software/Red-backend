import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsArray, IsUUID } from 'class-validator';

export class CreatePromotionInfraestructureRequestDTO {
    @ApiProperty({ required: true, default: 'Promocion de navidad 2025 sobre los productos navideños' })
    @IsString()
    description: string;

    @ApiProperty({ example: 'Promocion de navidad 2025' })
    @IsString()
    name: string;
    
    @ApiProperty({ example: true })
    @IsBoolean()
    avaleableState: boolean;

    @ApiProperty({ example: 0.5 })
    @IsNumber()
    discount: number;
  
    @ApiProperty({ example: '["2c6c1571-deae-4a8a-a359-7fc8cc37a55b","de23a438-b272-42fc-b316-c8f2165cb0fd"]' })
    @IsArray()
    @IsUUID('4', { each: true })
    products: string[]; 

    @ApiProperty({ example: '["de23a438-b272-42fc-b316-c8f2165cb0fd","de23a438-b272-42fc-b316-c8f2165cb0fd"]' })
    @IsArray()
    @IsUUID('4', { each: true })
    bundles: string[]; 

    // @ApiProperty({ example: '["e3a1d9c4-0b86-40e1-8adb-f4e5ccb7c2ff","de23a438-b272-42fc-b316-c8f2165cb0fd"]' })
    // @IsArray()
    // @IsUUID('4', { each: true })
    // categories: string[]; 
}
