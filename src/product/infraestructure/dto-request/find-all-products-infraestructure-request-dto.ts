import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsBase64, isBase64, IsDate, IsDateString, IsNegative, IsNumber, IsOptional, isPositive, IsPositive, IsString, MinLength } from "class-validator"

export class FindAllProductsInfraestructureRequestDTO{
  @ApiProperty( { required: false, default: 1, minimum: 1 })
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => { return Number(value); })  
  page?: number

  @ApiProperty( { required: false, default: 10, minimum: 1 })
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => { return Number(value); })  
  perPage?: number
}