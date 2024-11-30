import { Channel } from "diagnostics_channel"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { UpdateProfileInfraestructureRequestDTO } from "../dto/request/update-profile-infraestructure-request-dto"
import { Controller, Inject, Patch, Body } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { UpdateProfileInfraestructureResponseDTO } from "../dto/response/update-profile-infraestructure-response-dto"

@ApiTags('User')
@Controller('user')
export class UserController {

  private readonly idGen: IIdGen<string> 
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen= new UuidGen()
  }

  @Patch('update/profile')
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: UpdateProfileInfraestructureResponseDTO,
  })
  async UpdateProfile( @Body() entry:UpdateProfileInfraestructureRequestDTO ) {        
  }
}