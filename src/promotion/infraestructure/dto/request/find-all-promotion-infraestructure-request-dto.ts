import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto"

export class FindAllPromotionInfraestructureRequestDTO extends PaginationDto{
    @ApiProperty( { required: false })
    @IsOptional()
    @IsString()
    term:string
}