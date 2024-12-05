import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive } from "class-validator";
import { Transform } from "class-transformer";


export class FindAllPaymentMethodEntryDto {
    @ApiProperty( { required: false })
    @IsOptional()
    @IsPositive()
    @Transform(({ value }) => { return Number(value); })  
    page?: number

    @ApiProperty( { required: false, default: 5, minimum: 1 })
    @IsOptional()
    @IsPositive()
    @Transform(({ value }) => { return Number(value); })  
    perPage?: number
}