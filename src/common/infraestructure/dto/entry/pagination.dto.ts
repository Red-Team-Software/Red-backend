import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';


export class PaginationDto {

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