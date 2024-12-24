import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { UpdateProfileInfraestructureRequestDTO } from "../dto/request/update-profile-infraestructure-request-dto"
import { Controller, Inject, Patch, Body, Get, Query, Post, UseGuards, BadRequestException, Logger, Delete, Put } from "@nestjs/common"
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger"
import { UpdateProfileInfraestructureResponseDTO } from "../dto/response/update-profile-infraestructure-response-dto"
import { OrmUserQueryRepository } from "../repositories/orm-repository/orm-user-query-repository"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface"
import { UserId } from "src/user/domain/value-object/user-id"
import { OrmUserCommandRepository } from "../repositories/orm-repository/orm-user-command-repository"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { AddUserDirectionsInfraestructureRequestDTO } from "../dto/request/add-user-direction-infreaestructure-request-dto"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { AddUserDirectionApplicationService } from "src/user/application/services/command/add-user-direction-application.service"
import { AddUserDirectionInfraestructureResponseDTO } from "../dto/response/add-user-direction-infraestructure-response-dto"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard"
import { ISession } from "src/auth/application/model/session.interface"
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator"
import { ICredential } from "src/auth/application/model/credential.interface"
import { Roles } from "src/auth/infraestructure/jwt/decorator/roles.decorator"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { RolesGuard } from "src/auth/infraestructure/jwt/guards/roles.guard"
import { IAuditRepository } from "src/common/application/repositories/audit.repository"
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository"
import { UpdateProfileApplicationService } from "src/user/application/services/command/update-profile-application.service"
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher"
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader"
import { Channel } from "amqplib"
import { ImageTransformer } from "src/common/infraestructure/image-helper/image-transformer"
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator"
import { NestLogger } from "src/common/infraestructure/logger/nest-logger"
import { ICommandAccountRepository } from "src/auth/application/repository/command-account-repository.interface"
import { IAccount } from "src/auth/application/model/account.interface"
import { OrmAccountCommandRepository } from "src/auth/infraestructure/repositories/orm-repository/orm-account-command-repository"
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { OrmAccountQueryRepository } from "src/auth/infraestructure/repositories/orm-repository/orm-account-query-repository"
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface"
import { BcryptEncryptor } from "src/common/infraestructure/encryptor/bcrypt-encryptor"
import { DeleteUserDirectionsInfraestructureRequestDTO } from "../dto/request/delete-user-direction-infreaestructure-request-dto"
import { DeleteUserDirectionInfraestructureResponseDTO } from "../dto/response/delete-user-direction-infreaestructure-response-dto"
import { DeleteUserDirectionApplicationService } from "src/user/application/services/command/delete-user-direction-application.service"
import { UpdateUserDirectionInfraestructureResponseDTO } from "../dto/response/update-user-direction-infreaestructure-response-dto"
import { UpdateUserDirectionsInfraestructureRequestDTO } from "../dto/request/update-user-direction-infreaestructure-request-dto"
import { UpdateUserDirectionApplicationService } from "src/user/application/services/command/update-user-direction-application.service"
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator"
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler"
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator"
import { NestTimer } from "src/common/infraestructure/timer/nets-timer"
import { IGeocodification } from "src/order/domain/domain-services/geocodification-interface"
import { GeocodificationHereMapsDomainService } from "src/order/infraestructure/domain-service/geocodification-here-maps-domain-service"
import { HereMapsSingelton } from "src/common/infraestructure/here-maps/here-maps-singleton"
import { FindUserDirectionsByIdApplicationRequestDTO } from "src/user/application/dto/response/find-directions-by-user-id-response-dto"
import { OrderDirection } from "src/order/domain/value_objects/order-direction"
import { GeocodificationOpenStreeMapsDomainService } from "src/order/infraestructure/domain-service/geocodification-naminatim-maps-domain-service"

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {

  private readonly idGen: IIdGen<string> 
  private readonly ormUserQueryRepo:IQueryUserRepository
  private readonly ormUserCommandRepo:ICommandUserRepository
  private readonly ormAccountCommandRepo:ICommandAccountRepository<IAccount>
  private readonly ormAccountQueryRepo:IQueryAccountRepository<IAccount>
  private readonly auditRepository: IAuditRepository
  private readonly imageTransformer:ImageTransformer
  private readonly encryptor: IEncryptor
  private readonly geocodification: IGeocodification
  private readonly hereMapsSingelton: HereMapsSingelton;

  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen= new UuidGen()
    this.ormUserQueryRepo=new OrmUserQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormUserCommandRepo=new OrmUserCommandRepository(PgDatabaseSingleton.getInstance())
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
    this.ormAccountCommandRepo= new OrmAccountCommandRepository(PgDatabaseSingleton.getInstance())
    this.ormAccountQueryRepo= new OrmAccountQueryRepository(PgDatabaseSingleton.getInstance())
    this.imageTransformer= new ImageTransformer()
    this.encryptor= new BcryptEncryptor()
    this.hereMapsSingelton= HereMapsSingelton.getInstance()
    this.geocodification= new GeocodificationOpenStreeMapsDomainService()

  }

  @Patch('update/profile')
  @ApiResponse({
    status: 200,
    description: 'User information',
    type: UpdateProfileInfraestructureResponseDTO,
  })
  async UpdateProfile( 
    @GetCredential() credential:ICredential,
    @Body() entry:UpdateProfileInfraestructureRequestDTO ) { 

      let image: Buffer = null
      if (
        !entry.email &&
        !entry.image &&
        !entry.name &&
        !entry.password &&
        !entry.phone
      ) throw new BadRequestException('Error you must have at least one of the params filled')

      if(entry.image)
        image=(await this.imageTransformer.base64ToFile(entry.image)).buffer

      let service= 
      new ExceptionDecorator(
        new AuditDecorator(
          // new LoggerDecorator(
            new PerformanceDecorator(
              new UpdateProfileApplicationService(
                this.ormUserCommandRepo,
                this.ormUserQueryRepo,
                this.ormAccountCommandRepo,
                this.ormAccountQueryRepo,
                new RabbitMQPublisher(this.channel),
                new CloudinaryService(),
                this.idGen,
                this.encryptor
            // ), new NestLogger(new Logger())
            ), new NestTimer(), new NestLogger(new Logger())
          ),this.auditRepository, new DateHandler()
        )
    )
    let response= await service.execute({
      userId:credential.account.idUser,
      ...entry,image,
      accountId:credential.account.id
    })
    return response.getValue       
  }

  @Get('')
  async findUserById(@Query() entry:{id:string}){
    let response=await this.ormUserQueryRepo.findUserById(UserId.create(entry.id))
    return response.getValue
  }

  @Get('directions')
  async findUserDirectionById(@GetCredential() credential:ICredential){
    let response=await this.ormUserQueryRepo.findUserDirectionsByUserId(UserId.create(credential.account.idUser));

    let directions = response.getValue

    let dir: FindUserDirectionsByIdApplicationRequestDTO[] = [];

    for (let direction of directions){
      let geo = OrderDirection.create(direction.lat,direction.lng);
      let geoReponse= await this.geocodification.LatitudeLongitudetoDirecction(geo);

      console.log('response:',geoReponse.getValue)

      dir.push({
        ...direction,
        address:geoReponse.isSuccess()
        ? geoReponse.getValue.Address
        : 'no direction get it'
      })
    }

    return dir
  }

  @Post('add-directions')
  @ApiResponse({
    status: 200,
    description: 'User direction information',
    type: AddUserDirectionInfraestructureResponseDTO,
  })
  async addDirectionToUser(
    @GetCredential() credential:ICredential ,
    @Body() entry:AddUserDirectionsInfraestructureRequestDTO){

    let service= new ExceptionDecorator(
      new AuditDecorator(
        new LoggerDecorator(
          new PerformanceDecorator(
            new AddUserDirectionApplicationService (
              this.ormUserCommandRepo,
              this.ormUserQueryRepo,
              new RabbitMQPublisher(this.channel)
            ), new NestTimer(), new NestLogger(new Logger())
          ), new NestLogger(new Logger())
        ),this.auditRepository, new DateHandler()
      )
  )
  let response = await service.execute({userId:credential.account.idUser,...entry})
  return response.getValue
  }

  @Delete('delete-directions')
  @ApiResponse({
    status: 200,
    description: 'Delete direction information',
    type: DeleteUserDirectionInfraestructureResponseDTO,
  })
  async deleteDirectionToUser(
    @GetCredential() credential:ICredential ,
    @Body() entry:DeleteUserDirectionsInfraestructureRequestDTO){

    let service= new ExceptionDecorator(
      new AuditDecorator(  
        new LoggerDecorator(
          new PerformanceDecorator(
            new DeleteUserDirectionApplicationService (
              this.ormUserCommandRepo,
              this.ormUserQueryRepo,
              new RabbitMQPublisher(this.channel)
            ), new NestTimer(), new NestLogger(new Logger())
          ),new NestLogger(new Logger())
        ),this.auditRepository, new DateHandler()
      )
  )
  let response = await service.execute({userId:credential.account.idUser,...entry})
  return response.getValue
  }

  @Put('update-directions')
  @ApiResponse({
    status: 200,
    description: 'Delete direction information',
    type: UpdateUserDirectionInfraestructureResponseDTO,
  })
  async updateDirectionToUser(
    @GetCredential() credential:ICredential ,
    @Body() entry:UpdateUserDirectionsInfraestructureRequestDTO){

    let service= new ExceptionDecorator(
      new AuditDecorator(
        new LoggerDecorator(
          new PerformanceDecorator(
              new UpdateUserDirectionApplicationService (
                this.ormUserCommandRepo,
                this.ormUserQueryRepo,
                new RabbitMQPublisher(this.channel)
              ), new NestTimer(), new NestLogger(new Logger())
            ), new NestLogger(new Logger())
        ),this.auditRepository, new DateHandler()
      )
  )
  let response = await service.execute({userId:credential.account.idUser,...entry})
  return response.getValue
  }
}