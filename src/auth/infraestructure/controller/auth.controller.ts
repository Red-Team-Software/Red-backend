import { Controller, Inject, Post, Body, Logger, Put, Get, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger"
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
import { LogInUserInfraestructureRequestDTO } from "../dto/request/log-in-user-infraestructure-request-dto"
import { LogInUserInfraestructureResponseDTO } from "../dto/response/log-in-user-infraestructure-response-dto"
import { LogInUserApplicationService } from "src/auth/application/services/command/log-in-user-application.service"
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface"
import { OrmUserQueryRepository } from "src/user/infraestructure/repositories/orm-repository/orm-user-query-repository"
import { ICommandTokenSessionRepository } from "src/auth/application/repository/command-token-session-repository.interface"
import { ISession } from "src/auth/application/model/session.interface"
import { OrmTokenCommandRepository } from "../repositories/orm-repository/orm-token-command-session-repository"
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface"
import { JwtGenerator } from "../jwt/jwt-generator"
import { JwtService } from "@nestjs/jwt"
import { ForgetPasswordInfraestructureRequestDTO } from "../dto/request/forget-password-infraestructure-request-dto"
import { ForgetPasswordInfraestructureResponseDTO } from "../dto/response/forget-password-infraestructure-response-dto"
import { ForgetPasswordApplicationService } from "src/auth/application/services/command/forget-password-application.service"
import { ICodeGenerator } from "src/common/application/code-generator-interface/code-generator.interface"
import { CodeGenerator } from "src/common/infraestructure/code-generator/codegenerator"
import { SendGridSendCodeEmailSender } from "src/common/infraestructure/email-sender/send-grid-send-code-email-sender.service"
import { CodeValidateInfraestructureResponseDTO } from "../dto/response/code-validate-infraestructure-response-dto"
import { CodeValidateApplicationService } from "src/auth/application/services/command/code-validate-application.service"
import { CodeValidateInfraestructureRequestDTO } from "../dto/request/code-validate-infraestructure-request-dto"
import { ChangePasswordApplicationService } from "src/auth/application/services/command/change-password-application.service"
import { ChangePasswordInfraestructureRequestDTO } from "../dto/request/change-password-infraestructure-request-dto"
import { ChangePasswordInfraestructureResponseDTO } from "../dto/response/change-password-infraestructure-response-dto"
import { CurrentUserInfraestructureResponseDTO } from "../dto/response/current-user-infraestructure-response-dto"
import { GetCredential } from "../jwt/decorator/get-credential.decorator"
import { ICredential } from "src/auth/application/model/credential.interface"
import { JwtAuthGuard } from "../jwt/guards/jwt-auth.guard"
import { UserId } from "src/user/domain/value-object/user-id"
import { PersistenceException } from "src/common/infraestructure/infraestructure-exception"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator"
import { NestTimer } from "src/common/infraestructure/timer/nets-timer"
import { IUserExternalAccount } from "src/auth/application/interfaces/user-external-account-interface"
import { UserStripeAccount } from "../external-account/user-stripe-account"
import { StripeSingelton } from "src/common/infraestructure/stripe/stripe-singelton"
import { envs } from "src/config/envs/envs"
import { IMessagesSubscriber } from "src/common/application/messages/messages-susbcriber/messages-subscriber.interface"
import { IMessagesPublisher } from "src/common/application/messages/messages-publisher/messages-publisher.interface"
import { RabbitMQMessagePublisher } from "src/common/infraestructure/messages/publisher/rabbit-mq-message-publisher"
import { RabbitMQMessageSubscriber } from "src/common/infraestructure/messages/subscriber/rabbit-mq-message-subscriber"
import { AuthQueues } from "../queues/auth.queues"
import { IAccountRegistered } from "../interface/account-registered.interface"
import { AccountRegisteredSyncroniceService } from "../services/syncronice/account-registered-syncronice.service"
import mongoose, { Mongoose } from "mongoose"

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  private readonly idGen: IIdGen<string> 
  private readonly dateHandler: IDateHandler 
  private readonly encryptor: IEncryptor
  private readonly jwtGen:IJwtGenerator<string>
  private readonly auditRepository: IAuditRepository
  private readonly commandAccountRepository: ICommandAccountRepository<IAccount>
  private readonly queryAccountRepository: IQueryAccountRepository<IAccount>
  private readonly commandUserRepository:ICommandUserRepository
  private readonly queryUserRepository: IQueryUserRepository
  private readonly commandTokenSessionRespository:ICommandTokenSessionRepository<ISession>
  private readonly eventPublisher:IEventPublisher
  private readonly codeGenerator:ICodeGenerator<string>
  private readonly saveUserExternalApi: IUserExternalAccount
  private readonly messageSuscriber:RabbitMQMessageSubscriber
  private readonly messagePubliser:IMessagesPublisher

  private initializeQueues():void{        
    AuthQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
  }
  
  private buildQueue(name: string, pattern: string) {
      this.messageSuscriber.buildQueue({
            name,
            pattern,
            exchange: {
              name: 'Messages',
              type: 'direct',
              options: {
                durable: false,
              },
       },
    })
  }
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel,
    @Inject("MONGO_CONNECTION") private readonly mongoose: Mongoose,
    private jwtAuthService: JwtService
  ) {
    this.idGen= new UuidGen()
    this.dateHandler=new DateHandler()
    this.encryptor= new BcryptEncryptor()
    this.jwtGen= new JwtGenerator(jwtAuthService)
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
    this.commandAccountRepository=new OrmAccountCommandRepository(PgDatabaseSingleton.getInstance())
    this.queryAccountRepository=new OrmAccountQueryRepository(PgDatabaseSingleton.getInstance())
    this.commandUserRepository=new OrmUserCommandRepository(PgDatabaseSingleton.getInstance())
    this.queryUserRepository=new OrmUserQueryRepository(PgDatabaseSingleton.getInstance())
    this.commandTokenSessionRespository= new OrmTokenCommandRepository(PgDatabaseSingleton.getInstance())
    this.eventPublisher= new RabbitMQPublisher(this.channel)
    this.codeGenerator= new CodeGenerator()
    this.saveUserExternalApi= new UserStripeAccount(StripeSingelton.getInstance())
    this.messagePubliser= new RabbitMQMessagePublisher(this.channel)
    this.messageSuscriber= new RabbitMQMessageSubscriber(this.channel)

    this.initializeQueues()

    this.messageSuscriber.consume<IAccountRegistered>(
      { name: 'Messages/AccountRegistered' },
      (data):Promise<void>=>{
        this.syncAccountRegistered(data)
        return
      }
    )
    
    this.messageSuscriber.consume<IAccountRegistered>(
      { name: 'Messages/SessionRegistered' },
      (data):Promise<void>=>{
        this.syncAccountLogIn(data)
        return
      }
    )
  }

  async syncAccountRegistered(data:IAccountRegistered){
    let service = new AccountRegisteredSyncroniceService(mongoose)
    await service.execute(data)    
  }

  async syncAccountLogIn(data:IAccountRegistered){
    let service = new AccountRegisteredSyncroniceService(mongoose)
    await service.execute(data)    
  }

  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'User succed information',
    type: RegisterUserInfraestructureResponseDTO,
  })
  async register( @Body() entry: RegisterUserInfraestructureRequestDTO ) {        

      let service= new ExceptionDecorator(
      new AuditDecorator(
          // new LoggerDecorator(
            new PerformanceDecorator(
              new RegisterUserApplicationService(
                this.commandAccountRepository,
                this.queryAccountRepository,
                this.commandUserRepository,
                this.queryUserRepository,
                this.idGen,
                this.encryptor,
                this.dateHandler,
                this.eventPublisher,
                this.saveUserExternalApi,
                this.jwtGen,
                this.messagePubliser
              ),new NestTimer(),new NestLogger(new Logger())
            // ),new NestLogger(new Logger())
          ),this.auditRepository,this.dateHandler)
        )
      
      let response=await service.execute({userId:'none',...entry})
      return response.getValue
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User log to the system',
    type: LogInUserInfraestructureResponseDTO,
  })
  async login( @Body() entry: LogInUserInfraestructureRequestDTO ) {        

      let service=
      new ExceptionDecorator(
        new AuditDecorator(
            // new LoggerDecorator(
              new PerformanceDecorator(
                new LogInUserApplicationService(
                  this.queryUserRepository,
                  this.queryAccountRepository,
                  this.commandTokenSessionRespository,
                  this.encryptor,
                  this.idGen,
                  this.jwtGen,
                  this.dateHandler,
                  this.messagePubliser
                ), new NestTimer(), new NestLogger(new Logger())
              // ),new NestLogger(new Logger())
          ),this.auditRepository,this.dateHandler
        )
      )
    
      let response=await service.execute({userId:'none',...entry})
      return response.getValue
  }

  @Post('forget/password')
  @ApiResponse({
    status: 200,
    description: 'User recieve a email and a push with the code',
    type: ForgetPasswordInfraestructureResponseDTO,
  })
  async forgetPassword( @Body() entry: ForgetPasswordInfraestructureRequestDTO ) {        

      let service=
        new ExceptionDecorator(
          new LoggerDecorator(
            new PerformanceDecorator(
              new ForgetPasswordApplicationService(
                this.queryAccountRepository,
                this.commandAccountRepository,
                this.queryUserRepository,
                this.encryptor,
                this.codeGenerator,
                this.dateHandler,
                new SendGridSendCodeEmailSender()
              ), new NestTimer(), new NestLogger(new Logger())
            ),new NestLogger(new Logger())
          )
        )
      
      let response=await service.execute({userId:'none',...entry})
      return response.getValue
  }

  @Post('code/validate')
  @ApiOkResponse({  description: 'Validar codigo de cambio de contraseña', type: CodeValidateInfraestructureResponseDTO })
  async validateCodeForgetPassword( @Body() entry: CodeValidateInfraestructureRequestDTO ) {
    let service=
    new ExceptionDecorator(
      // new LoggerDecorator(
        new PerformanceDecorator(
          new CodeValidateApplicationService(
            this.queryAccountRepository,
            this.queryUserRepository,
            this.encryptor,
            this.dateHandler,
          ), new NestTimer(), new NestLogger(new Logger())
        // ),new NestLogger(new Logger())
      )
    )
  
  let response=await service.execute({userId:'none',...entry})
  return response.getValue
  }

  @Put('change/password')
  @ApiOkResponse({  description: 'Validar codigo de cambio de contraseña', type: ChangePasswordInfraestructureResponseDTO })
  async changePassword( @Body() entry: ChangePasswordInfraestructureRequestDTO ) {
    let service=
    new ExceptionDecorator(
      // new LoggerDecorator(
        new PerformanceDecorator(
          new ChangePasswordApplicationService(
            this.queryAccountRepository,
            this.commandAccountRepository,
            this.encryptor,
            this.dateHandler
          ), new NestTimer(), new NestLogger(new Logger())
        // ),new NestLogger(new Logger())
      )
    )
  
  let response=await service.execute({userId:'none',...entry})
  return response.getValue
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('current')
  @ApiOkResponse({  description: 'Get current User data', type: CurrentUserInfraestructureResponseDTO })
  async currentUser( @GetCredential() credential:ICredential ) {

    let userResponse=await this.queryUserRepository.findUserById(UserId.create(credential.account.idUser))

    if (!userResponse.isSuccess())
      throw new PersistenceException('account id is not found')

    const user=userResponse.getValue
    const response:CurrentUserInfraestructureResponseDTO={
      id: credential.account.idUser,
      email: credential.account.email,
      name: user.UserName.Value,
      phone: user.UserPhone.Value,
      image: user.UserImage ? user.UserImage.Value : null,
      type: user.UserRole.Value as UserRoles,
      wallet: {
        walletId: user.Wallet.getId().Value,
        Ballance:{
          currency: user.Wallet.Ballance.Currency,
          amount: user.Wallet.Ballance.Amount
        },
      }
    }
    return response
  }

}
