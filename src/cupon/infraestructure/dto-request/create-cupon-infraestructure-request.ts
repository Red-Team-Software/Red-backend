import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { ArrayMinSize, IsArray, IsBase64, isBase64, IsBoolean, IsDate, IsDateString, IsNegative, IsNumber, isPositive, IsPositive, IsString, MinLength } from "class-validator"

export class CreateCuponInfraestructureRequestDTO{

  
    @ApiProperty( { required: true, default: 'Dulce' })
    @IsString()
    @MinLength( 3 )
    name: string

    @ApiProperty( { required: true, default: 'codigo1' })
    @IsString()
    @MinLength( 3 )
    code: string

    @ApiProperty( { required: true, default: 0.1 })
    @IsNumber()
    @IsPositive()
    discount: number

    @ApiProperty( { required: true, default: true })
    @IsBoolean()
    state: boolean


}