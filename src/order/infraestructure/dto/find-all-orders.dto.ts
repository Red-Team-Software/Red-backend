import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive } from "class-validator";
import { Transform } from "class-transformer";
import { UserId } from '../../../user/domain/value-object/user-id';


export class FindAllOrdersEntryDto {

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