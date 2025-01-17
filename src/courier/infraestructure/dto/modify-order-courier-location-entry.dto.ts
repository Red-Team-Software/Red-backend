import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";
import { Transform } from "class-transformer";


export class ModifyCourierLocationEntryDto {
    
    
    @ApiProperty( { example: '40.5515412', required: true })
    @IsString()
    lat: string;

    @ApiProperty( { example: '-10.5265', required: true })
    @IsString()
    long: string;


}