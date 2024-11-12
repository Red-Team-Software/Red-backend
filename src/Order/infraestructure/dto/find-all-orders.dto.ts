import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive } from "class-validator";
import { Transform } from "class-transformer";


export class FindAllOrdersEntryDto {
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