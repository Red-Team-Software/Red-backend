import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";


export class FindAllProductsInfraestructureRequestDTO extends PaginationDto{

    @ApiProperty({ required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? [value] : value)
    category: string[];

    @ApiProperty( { required: false })
    @IsString()
    @IsOptional()
    name:string

    @ApiProperty( { required: false })
    @Transform(({ value }) => {
        return Number(value);
    })
    @IsNumber()
    @IsOptional()
    price:number

    @ApiProperty( { required: false })
    @IsString()
    @IsOptional()
    popular:string

    @ApiProperty( { required: false })
    @Transform(({ value }) => {
        return Number(value);
    })
    @IsNumber()
    @IsOptional()
    discount:number
}