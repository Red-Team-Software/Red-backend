import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsPositive, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";


export class FindAllOrdersEntryDto extends PaginationDto{


    @ApiProperty({ required: false, description: "Active or Past" })
    @IsString()
    @IsOptional()
    @IsIn(['active', 'past'])
    state?: string;
}