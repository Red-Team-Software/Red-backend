import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class FindAllCuponsInfraestructureRequestDTO {
  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => { return Number(value); })
  page?: number;

  @ApiProperty({ required: false, default: 10, minimum: 1 })
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => { return Number(value); })
  perPage?: number;
}
