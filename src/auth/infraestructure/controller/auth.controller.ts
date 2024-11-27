import { Controller, Inject, Post, Body } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { Channel } from "diagnostics_channel"
import { IDateHandler } from "src/common/application/date-handler/date-handler.interface"
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { RegisterUserInfraestructureRequestDTO } from "../dto/request/register-user-infraestructure-request-dto"
import { RegisterUserInfraestructureResponseDTO } from "../dto/response/register-user-infraestructure-response-dto"

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  private readonly idGen: IIdGen<string> 
  private readonly dateHandler: IDateHandler 
  private readonly encryptor: IEncryptor
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen= new UuidGen()
    // this.ormProductRepo= new OrmProductRepository(PgDatabaseSingleton.getInstance())
  }

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'User succed information',
    type: RegisterUserInfraestructureResponseDTO,
  })
  async register( @Body() entry: RegisterUserInfraestructureRequestDTO ) {        
      const hashed = await this.encryptor.hashPassword(entry.password)

  }


  @Post('sign-up')
  @ApiResponse({
    status: 200,
    description: 'User succed information',
    type: RegisterUserInfraestructureResponseDTO,
  })
  async signUpAccount( @Body() entry: RegisterUserInfraestructureRequestDTO ) {        
      const hashed = await this.encryptor.hashPassword(entry.password)

  }
}
