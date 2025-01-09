import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MinLength } from "class-validator";


export class CreateCourierEntryDTO{

    @ApiProperty( { required: true, default: 'Raul Alberto' })
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty( { example: '40.5515412', required: true })
    @IsNumber()
    lat: number;
    
    @ApiProperty( { example: '-10.5265', required: true })
    @IsNumber()
    long: number;

}