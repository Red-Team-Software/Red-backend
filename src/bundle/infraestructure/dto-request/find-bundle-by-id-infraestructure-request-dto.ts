import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID } from "class-validator"

export class FindBundleByIdInfraestructureRequestDTO{
  @ApiProperty( { required: true, default: '94bfc16a-0757-45f5-a326-6dceac87b8fd' })
  @IsString()
  @IsUUID()
  id:string
}