import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";


export class RegisterCourierEntryDTO{

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

    @ApiProperty( { required: true, default: 'gadeso2003@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty( { required: true, default: 'password' })
    @IsString()
    password: string
}