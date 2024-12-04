import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID } from "class-validator"

export class FindPromotionByIdInfraestructureRequestDTO {
  @ApiProperty( { required: true, default: '87eeb5ee-9d2b-4fb6-9e11-ded6d76f636e' })
  @IsString()
  @IsUUID()
  id:string
}