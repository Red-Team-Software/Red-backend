import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { UpdateProfileInfraestructureRequestDTO } from "../dto/request/update-profile-infraestructure-request-dto"
import { Controller, Inject, Patch, Body, Get, Query, Post, UseGuards, BadRequestException, Logger, Delete, Put, Param, UseInterceptors, FileTypeValidator, ParseFilePipe, UploadedFile } from "@nestjs/common"
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
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator"
import { ICredential } from "src/auth/application/model/credential.interface"
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
import { IGeocodification } from "src/order/domain/domain-services/interfaces/geocodification-interface"
import { HereMapsSingelton } from "src/common/infraestructure/here-maps/here-maps-singleton"
import { OrderDirection } from "src/order/domain/value_objects/order-direction"
import { GeocodificationOpenStreeMapsDomainService } from "src/order/infraestructure/domain-service/geocodification-naminatim-maps-domain-service"
import { FindUserDirectionApplicationService } from "src/user/application/services/query/find-user-direction-application.service"
import { FindUserDirectionByIdApplicationService } from "src/user/application/services/query/find-user-direction-by-id-application.service"
import { ByIdDTO } from "src/common/infraestructure/dto/entry/by-id.dto"
import { AddUserCouponInfraestructureRequestDTO } from "../dto/request/add-user-coupon-application-request-dto"
import { AddUserCouponApplicationService } from "src/user/application/services/command/add-user-coupon-application.service"
import { IQueryCuponRepository } from "src/cupon/application/query-repository/query-cupon-repository"
import { OrmCuponQueryRepository } from "src/cupon/infraestructure/repository/orm-repository/orm-cupon-query-repository"
import { UserQueues } from "../queues/user.queues"
import { ICreateOrder } from "src/notification/infraestructure/interfaces/create-order.interface"
import { RabbitMQSubscriber } from "src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber"
import { Mongoose } from "mongoose"
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileApplicationRequestDTO } from "src/user/application/dto/request/update-profile-application-request-dto"
import { UpdateProfileApplicationResponseDTO } from "src/user/application/dto/response/update-profile-application-response-dto"
import { OdmCuponQueryRepository } from "src/cupon/infraestructure/repository/odm-repository/odm-query-coupon-repository"
import { IUserRegistered } from "../interfaces/user-registered.interface"
import { UserRegisteredSyncroniceService } from "../services/syncronice/user-registered-syncronice.service"
import { UserUpdatedInfraestructureRequestDTO } from "../services/dto/request/user-updated-infraestructure-request-dto"
import { UserUpdatedSyncroniceService } from "../services/syncronice/user-updated-syncronice.service"
import { IUserBalanceAmountAdded } from "../interfaces/user-balance-amount-added.interface"
import { IUserBalanceAmountDecremented } from "../interfaces/user-balance-amount-decremented.interface"
import { IUserCouponAplied } from "../interfaces/user-coupon-aplied.interface"
import { IUserDirectionAdded } from "../interfaces/user-direction-added.interface"
import { IUserDirectionDeleted } from "../interfaces/user-direction-deleted.interface"
import { IUserDirectionUpdated } from "../interfaces/user-direction-updated.interface"
import { IUserImageUpdated } from "../interfaces/user-image-updated.interface"
import { IUserNameUpdated } from "../interfaces/user-name-updated.interface"
import { IUserPhoneUpdated } from "../interfaces/user-phone-updated.interface"

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
  private readonly ormCuponQueryRepo: IQueryCuponRepository;
  private readonly subscriber: RabbitMQSubscriber;
  
    private initializeQueues():void{        
      UserQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
        }
        
    private buildQueue(name: string, pattern: string) {
      this.subscriber.buildQueue({
        name,
        pattern,
        exchange: {
          name: 'DomainEvent',
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
    this.ormCuponQueryRepo = new OdmCuponQueryRepository(mongoose);
    this.subscriber= new RabbitMQSubscriber(this.channel);
    
    this.initializeQueues();
        
    this.subscriber.consume<ICreateOrder>(
      { name: 'ApplyCoupon/OrderRegistered'}, 
        (data):Promise<void>=>{
            this.aplyCoupon(data)
            return
        }
    )

    this.subscriber.consume<IUserBalanceAmountAdded>(
      { name: 'UserSync/UserBalanceAmountAdded'},
      (data):Promise<void>=>{
            this.userupdatedsync(data)
            return
        }
    )

    this.subscriber.consume<IUserBalanceAmountDecremented>(
      { name: 'UserSync/UserBalanceAmountDecremented'},
      (data):Promise<void>=>{
            this.userupdatedsync(data)
            return
        }
    )

    this.subscriber.consume<IUserCouponAplied>(
    { name: 'UserSync/UserCouponAplied'},
      (data):Promise<void>=>{
            this.userupdatedsync({...data,coupons:[{...data.coupons}]})
            return
        }
    )

    this.subscriber.consume<IUserDirectionAdded>(
      { name: 'UserSync/UserDirectionAdded'},
      (data):Promise<void>=>{
              this.userupdatedsync({...data})
              return
          }
      )

    // this.subscriber.consume<IUserDirectionDeleted>(
    //   { name: 'UserSync/UserDirectionDeleted'},
    //   (data):Promise<void>=>{
    //           this.userupdatedsync({...data,})
    //           return
    //       }
    //   )

      this.subscriber.consume<IUserDirectionUpdated>(
        { name: 'UserSync/UserDirectionUpdated'},
        (data):Promise<void>=>{
                this.userupdatedsync({...data})
                return
            }
        )
      this.subscriber.consume<IUserImageUpdated>(
        { name: 'UserSync/UserImageUpdated'},
        (data):Promise<void>=>{
                this.userupdatedsync({...data})
                return
            }
        )

        this.subscriber.consume<IUserNameUpdated>(
          { name: 'UserSync/UserNameUpdated' },
          (data):Promise<void>=>{
                  this.userupdatedsync({...data})
                  return
              }
          )

          this.subscriber.consume<IUserPhoneUpdated>(
            { name: 'UserSync/UserPhoneUpdated'},
            (data):Promise<void>=>{
                    this.userupdatedsync({...data})
                    return
                }
            )

    this.subscriber.consume<IUserRegistered>(
      { name: 'UserSync/UserRegistered'},
      (data):Promise<void>=>{
            this.userregisteredsync(data)
            return
        }
    )
  }

  async userregisteredsync(data:IUserRegistered){
    let service=new UserRegisteredSyncroniceService(this.mongoose)
    await service.execute(data)
  }

  async userupdatedsync(data:UserUpdatedInfraestructureRequestDTO){
    let service=new UserUpdatedSyncroniceService(this.mongoose)
    await service.execute(data)
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

  @Patch('update/image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({
    status: 200,
    description: 'User image updated',
    type: UpdateProfileInfraestructureResponseDTO,
  })
  async UpdateProfileImage( 
    @GetCredential() credential:ICredential,
    @UploadedFile(
          new ParseFilePipe({
            validators: [
              new FileTypeValidator({
                fileType: /(jpeg|jpg|png)$/,
              }),
            ],
          })
        ) image: Express.Multer.File ) { 

      let service= 
      new ExceptionDecorator<UpdateProfileApplicationRequestDTO,UpdateProfileApplicationResponseDTO>(
        new AuditDecorator<UpdateProfileApplicationRequestDTO,UpdateProfileApplicationResponseDTO>(
          // new LoggerDecorator(
            new PerformanceDecorator<UpdateProfileApplicationRequestDTO,UpdateProfileApplicationResponseDTO>(
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

    const buffer = image.buffer;

    let response= await service.execute({
      userId:credential.account.idUser,
      image:buffer,
      accountId:credential.account.id
    })
    return {image:response.getValue.image}   
  }


  @Get('')
  async findUserById(@Query() entry:{id:string}){
    let response=await this.ormUserQueryRepo.findUserById(UserId.create(entry.id))
    return response.getValue
  }

  @Get('address/many')
  async findUserDirectionById(@GetCredential() credential:ICredential){
    let service= new ExceptionDecorator(
      new AuditDecorator(
        new LoggerDecorator(
          new PerformanceDecorator(
            new FindUserDirectionApplicationService (
              this.ormUserQueryRepo,
              this.geocodification
            ), new NestTimer(), new NestLogger(new Logger())
          ), new NestLogger(new Logger())
        ),this.auditRepository, new DateHandler()
      )
  )
  let response = await service.execute({
    userId:credential.account.idUser
  })
  return response.getValue
  }

  
  @Patch('update/address')
  @ApiResponse({
    status: 200,
    description: 'Update direction information',
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

  let response = await service.execute({
    userId:credential.account.idUser,
    directions:{...entry, id:entry.directionId , lat: Number(entry.lat), long: Number(entry.long)}
  })

  return response.getValue
  }

  @Get('address/:id')
  async findUserDirections(
    @Param() entry:ByIdDTO,
    @GetCredential() credential:ICredential){
    let service= new ExceptionDecorator(
      new AuditDecorator(
        new LoggerDecorator(
          new PerformanceDecorator(
            new FindUserDirectionByIdApplicationService (
              this.ormUserQueryRepo,
              this.geocodification
            ), new NestTimer(), new NestLogger(new Logger())
          ), new NestLogger(new Logger())
        ),this.auditRepository, new DateHandler()
      )
  )
  let response = await service.execute({
    userId:credential.account.idUser,...entry
  })
  return response.getValue
  }

  @Post('add/address')
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
              new RabbitMQPublisher(this.channel),
              new UuidGen()
            ), new NestTimer(), new NestLogger(new Logger())
          ), new NestLogger(new Logger())
        ),this.auditRepository, new DateHandler()
      )
  )
  let response = await service.execute({
    userId:credential.account.idUser,
    directions:{
      ...entry,
      lat: Number(entry.lat),
      long: Number(entry.long)
    }
  })
  return response.getValue
  }

  @Delete('delete/address/:id')
  @ApiResponse({
    status: 200,
    description: 'Delete direction information',
    type: DeleteUserDirectionInfraestructureResponseDTO,
  })
  async deleteDirectionToUser(
    @GetCredential() credential:ICredential ,
    @Param() entry:DeleteUserDirectionsInfraestructureRequestDTO){

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
  let response = await service.execute({userId:credential.account.idUser,directions:{id:entry.id}})
  return response.getValue
  }
  
  
  async aplyCoupon(entry:ICreateOrder){

    if (!entry.orderCupon || entry.orderCupon.length === 0)
      return

    let service= new ExceptionDecorator(
      new AuditDecorator(  
        new LoggerDecorator(
          new PerformanceDecorator(
            new AddUserCouponApplicationService (
              this.ormUserCommandRepo,
              this.ormUserQueryRepo,
              this.ormCuponQueryRepo,
              new RabbitMQPublisher(this.channel)
            ), new NestTimer(), new NestLogger(new Logger())
          ),new NestLogger(new Logger())
        ),this.auditRepository, new DateHandler()
      )
  )
  let response = await service.execute({userId: entry.orderUserId,idCoupon:entry.orderCupon})
  return response.getValue
  }
}