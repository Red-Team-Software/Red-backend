import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsString, MinLength } from "class-validator";


export class CreateCourierEntryDTO{

    @ApiProperty( { required: true, default: 'Raul Alberto' })
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty( { example: '40.55154', required: true })
    @IsNumber()
    @Transform(({ value }) => { return Number(value); }) 
    lat: number;
    
    @ApiProperty( { example: '-10.5265', required: true })
    @IsNumber()
    @Transform(({ value }) => { return Number(value); }) 
    long: number;

}