import { Controller, Inject, Post, Body, Logger } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { IDateHandler } from "src/common/application/date-handler/date-handler.interface"
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { RegisterUserInfraestructureRequestDTO } from "../dto/request/register-user-infraestructure-request-dto"
import { RegisterUserInfraestructureResponseDTO } from "../dto/response/register-user-infraestructure-response-dto"
import { IAuditRepository } from "src/common/application/repositories/audit.repository"
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler"
import { BcryptEncryptor } from "src/common/infraestructure/encryptor/bcrypt-encryptor"
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { RegisterUserApplicationService } from "src/auth/application/services/command/register-user-application.service"
import { ICommandAccountRepository } from "src/auth/application/repository/command-account-repository.interface"
import { IAccount } from "src/auth/application/model/account.interface"
import { IQueryAccountRepository } from "src/auth/application/repository/query-account-repository.interface"
import { OrmAccountCommandRepository } from "../repositories/orm-repository/orm-account-command-repository"
import { OrmAccountQueryRepository } from "../repositories/orm-repository/orm-account-query-repository"
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator"
import { NestLogger } from "src/common/infraestructure/logger/nest-logger"
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator"
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface"
import { IEventPublisher } from '../../../common/application/events/event-publisher/event-publisher.abstract';
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher"
import { Channel } from "amqplib"
import { OrmUserCommandRepository } from "src/user/infraestructure/repositories/orm-repository/orm-user-command-repository"

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  private readonly idGen: IIdGen<string> 
  private readonly dateHandler: IDateHandler 
  private readonly encryptor: IEncryptor
  private readonly auditRepository: IAuditRepository
  private readonly commandAccountRepository: ICommandAccountRepository<IAccount>
  private readonly queryAccountRepository: IQueryAccountRepository<IAccount>
  private readonly commandUserRepository:ICommandUserRepository
  private readonly eventPublisher:IEventPublisher
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen= new UuidGen()
    this.dateHandler=new DateHandler()
    this.encryptor= new BcryptEncryptor()
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
    this.commandAccountRepository=new OrmAccountCommandRepository(PgDatabaseSingleton.getInstance())
    this.queryAccountRepository=new OrmAccountQueryRepository(PgDatabaseSingleton.getInstance())
    this.commandUserRepository=new OrmUserCommandRepository(PgDatabaseSingleton.getInstance())
    this.eventPublisher= new RabbitMQPublisher(this.channel)
    
  }

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'User succed information',
    type: RegisterUserInfraestructureResponseDTO,
  })
  async register( @Body() entry: RegisterUserInfraestructureRequestDTO ) {        

      let service= new AuditDecorator(
        new ExceptionDecorator(
          new LoggerDecorator(
            new RegisterUserApplicationService(
              this.commandAccountRepository,
              this.queryAccountRepository,
              this.commandUserRepository,
              this.idGen,
              this.encryptor,
              this.dateHandler,
              this.eventPublisher
            )
            ,new NestLogger(new Logger())
          )
        ),this.auditRepository,
        this.dateHandler
      )
      
      let response=await service.execute({userId:'none',...entry})
      return response.getValue
  }

}
