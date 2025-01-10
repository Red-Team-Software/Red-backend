import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";
import { Transform } from "class-transformer";


export class ModifyCourierLocationEntryDto {
    
    @ApiProperty({ example: '2128865d-15af-4e61-a6f9-062ff3881e22',description: 'courier id' })
    @IsString()
    courierId: string;
    
    @ApiProperty( { example: '40.5515412', required: true })
    @IsNumber()
    @Transform(({ value }) => { return Number(value); })
    lat: number;

    @ApiProperty( { example: '-10.5265', required: true })
    @IsNumber()
    @Transform(({ value }) => { return Number(value); })
    long: number;


}