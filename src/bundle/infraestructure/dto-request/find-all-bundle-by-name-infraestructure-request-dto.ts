import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";

export class FindAllBundlesByNameInfraestructureRequestDTO extends PaginationDto{
  @ApiProperty( { required: true })
  @IsString()
  term:string
}