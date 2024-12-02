import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsBase64, IsOptional } from "class-validator";

export class CreateCategoryInfrastructureRequestDTO {
    @ApiProperty({ required: true, default: 'Vegetables' })
    @IsString()
    @MinLength(3)
    name: string;

}
