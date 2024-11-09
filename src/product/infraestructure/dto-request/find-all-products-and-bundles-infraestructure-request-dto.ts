import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsOptional, IsPositive, IsString } from "class-validator";

export class FindAllProductsAndBundlesInfraestructureRequestDTO{
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

  @ApiProperty( { required: true })
  @IsString()
  term:string
}