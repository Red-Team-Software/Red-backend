import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";


export class FindAllOrdersByUserInfraestructureEntryDto extends PaginationDto{

    @ApiProperty({ required: false, description: "Active or Past" })
    @IsString()
    @IsOptional()
    @IsIn(['active', 'past'])
    state?: string;
}