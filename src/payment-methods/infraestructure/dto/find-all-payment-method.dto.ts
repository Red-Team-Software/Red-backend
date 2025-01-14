import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";


export class FindAllPaymentMethodEntryDto extends PaginationDto{
}