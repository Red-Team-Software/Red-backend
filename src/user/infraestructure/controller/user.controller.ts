import { Channel } from "diagnostics_channel"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { UpdateProfileInfraestructureRequestDTO } from "../dto/request/update-profile-infraestructure-request-dto"
import { Controller, Inject, Patch, Body, Get, Query, Post, UseGuards } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { UpdateProfileInfraestructureResponseDTO } from "../dto/response/update-profile-infraestructure-response-dto"
import { OrmUserQueryRepository } from "../repositories/orm-repository/orm-user-query-repository"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { OrmUserCommandRepository } from "../repositories/orm-repository/orm-user-command-repository"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { AddUserDirectionsInfraestructureRequestDTO } from "../dto/request/add-user-direction-infreaestructure-request-dto"
import { CreateBundleApplicationService } from "src/bundle/application/services/command/create-bundle-application.service"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher"
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader"
import { AddUserDirectionApplicationService } from "src/user/application/services/command/add-user-direction-application.service"
import { AddUserDirectionInfraestructureResponseDTO } from "../dto/response/add-user-direction-infraestructure-response-dto"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard"

@ApiTags('User')
@Controller('user')
export class UserController {

  private readonly idGen: IIdGen<string> 
  private readonly ormUserQueryRepo:IQueryUserRepository
  private readonly ormUserCommandRepo:ICommandUserRepository
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen= new UuidGen()
    this.ormUserQueryRepo=new OrmUserQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormUserCommandRepo=new OrmUserCommandRepository(PgDatabaseSingleton.getInstance())
  }

  @Patch('update/profile')
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: UpdateProfileInfraestructureResponseDTO,
  })
  async UpdateProfile( @Body() entry:UpdateProfileInfraestructureRequestDTO ) {        
  }

  @Get('')
  async findUserById(@Query() entry:{id:string}){
    let response=await this.ormUserQueryRepo.findUserById(UserId.create(entry.id))
    return response.getValue
  }

  @Get('directions')
  async findUserDirectionById(@Query() entry:{id:string}){
    let response=await this.ormUserQueryRepo.findUserDirectionsByUserId(UserId.create(entry.id))
    return response
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-directions')
  @ApiResponse({
    status: 200,
    description: 'User direction information',
    type: AddUserDirectionInfraestructureResponseDTO,
  })
  async addDirectionToUser(@Body() entry:AddUserDirectionsInfraestructureRequestDTO){
    let service= new ExceptionDecorator(
      new AddUserDirectionApplicationService (
        this.ormUserCommandRepo,
        this.ormUserQueryRepo
      )
  )
  let response = await service.execute({userId:'none',...entry})
  }
}