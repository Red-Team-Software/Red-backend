import { Body, Controller, Get, Inject, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { PaginationRequestDTO } from 'src/common/application/services/dto/request/pagination-request-dto';
import { Channel } from 'amqplib';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { OrmBundleQueryRepository } from 'src/bundle/infraestructure/repositories/orm-repository/orm-bundle-query-repository';
import { RabbitMQPublisher } from 'src/common/infraestructure/events/publishers/rabbit-mq-publisher';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/guards/jwt-auth.guard';
import { ICredential } from 'src/auth/application/model/credential.interface';
import { GetCredential } from 'src/auth/infraestructure/jwt/decorator/get-credential.decorator';
import { PerformanceDecorator } from 'src/common/application/aspects/performance-decorator/performance-decorator';
import { AuditDecorator } from 'src/common/application/aspects/audit-decorator/audit-decorator';
import { IAuditRepository } from 'src/common/application/repositories/audit.repository';
import { OrmAuditRepository } from 'src/common/infraestructure/repository/orm-repository/orm-audit.repository';
import { DateHandler } from 'src/common/infraestructure/date-handler/date-handler';
import { NestTimer } from 'src/common/infraestructure/timer/nets-timer';
import { CreatePromotionApplicationService } from 'src/promotion/application/services/command/create-promotion-application.service';
import { CreatePromotionInfraestructureRequestDTO } from '../dto/request/create-promotion-infraestructure-request-dto';
import { CreatePromotionInfraestructureResponseDTO } from '../dto/response/create-promotion-infraestructure-response-dto';
import { FindPromotionByIdInfraestructureRequestDTO } from '../dto/request/find-product-by-id-infraestructure-request-dto';
import { FindAllPromotionInfraestructureRequestDTO } from '../dto/request/find-all-promotion-infraestructure-request-dto';
import { FindAllPromotionInfraestructureResponseDTO } from '../dto/response/find-all-promotion-infraestructure-response-dto';
import { FindPromotionByIdInfraestructureResponseDTO } from '../dto/response/find-promotion-by-id-infraestructure-response-dto';
import { IQueryPromotionRepository } from 'src/promotion/application/query-repository/promotion.query.repository.interface';
import { ICommandPromotionRepository } from 'src/promotion/domain/repository/promotion.command.repository.interface';
import { OrmPromotionQueryRepository } from '../repositories/orm-repository/orm-promotion-query-repository';
import { OrmPromotionCommandRepository } from '../repositories/orm-repository/orm-promotion-command-repository';
import { OrmProductQueryRepository } from 'src/product/infraestructure/repositories/orm-repository/orm-product-query-repository';
import { FindAllPromotionApplicationService } from 'src/promotion/application/services/query/find-all-promotion-application.service';
import { FindPromotionByIdApplicationService } from 'src/promotion/application/services/query/find-promotion-by-id-application.service';
import { ByIdDTO } from 'src/common/infraestructure/dto/entry/by-id.dto';
import { SecurityDecorator } from 'src/common/application/aspects/security-decorator/security-decorator';
import { UpdatePromotionApplicationService } from 'src/promotion/application/services/command/update-promotion-application.service';
import { UserRoles } from 'src/user/domain/value-object/enum/user.roles';
import { UpdatePromotionInfraestructureRequestDTO } from '../dto/request/update-promotion-infraestructure-request-dto';
import { PromotionQueues } from '../queues/promotion.queues';
import { RabbitMQSubscriber } from 'src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber';
import { IPromotionCreated } from '../interfaces/promotion-created';
import { PromotionRegisteredSyncroniceService } from '../services/syncronice/promotion-registered-syncronice.service';
import { Mongoose } from 'mongoose';
import { IPromotionBundlesUpdated } from '../interfaces/promotion-bundles-updated';
import { PromotionUpdatedInfraestructureRequestDTO } from '../services/dto/request/promotion-updated-infraestructure-request-dto';
import { PromotionUpdatedSyncroniceService } from '../services/syncronice/promotion-updated-syncronice.service';
import { IPromotionDescriptionUpdated } from '../interfaces/promotion-description-updated';
import { IPromotionDiscountUpdated } from '../interfaces/promotion-discount-updated';
import { IPromotionNameUpdated } from '../interfaces/promotion-name-updated';
import { IPromotionProductsUpdated } from '../interfaces/promotion-products-updated';
import { IPromotionStateUpdated } from '../interfaces/promotion-state-updated';
import { OdmPromotionQueryRepository } from '../repositories/odm-repository/odm-promotion-query-repository';
import { OdmBundleQueryRepository } from 'src/bundle/infraestructure/repositories/odm-repository/odm-bundle-query-repository';
import { OdmProductQueryRepository } from 'src/product/infraestructure/repositories/odm-repository/odm-product-query-repository';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Promotion')
@Controller('promotion')
export class PromotionController {

  private readonly idGen: IIdGen<string> 
  private readonly auditRepository: IAuditRepository
  private readonly ormPromotionQueryRepo:IQueryPromotionRepository
  private readonly ormPromotionCommandRepo:ICommandPromotionRepository
  private readonly ormQueryBundleRepo:IQueryBundleRepository
  private readonly ormQueryProductRepo:IQueryProductRepository
  private readonly subscriber: RabbitMQSubscriber
  private readonly odmQueryBundleRepo:IQueryBundleRepository
  private readonly odmQueryProductRepo:IQueryProductRepository
  private readonly odmPromotionQueryRepo:IQueryPromotionRepository

    private initializeQueues():void{        
      PromotionQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
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
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
    this.ormPromotionQueryRepo=new OrmPromotionQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormPromotionCommandRepo=new OrmPromotionCommandRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryBundleRepo=new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryProductRepo=new OrmProductQueryRepository(PgDatabaseSingleton.getInstance())
    this.subscriber= new RabbitMQSubscriber(this.channel)
    this.odmPromotionQueryRepo= new OdmPromotionQueryRepository(mongoose)

    this.odmQueryBundleRepo= new OdmBundleQueryRepository(mongoose)
    this.odmQueryProductRepo= new OdmProductQueryRepository(mongoose)
    this.odmPromotionQueryRepo = new OdmPromotionQueryRepository(mongoose)

    this.initializeQueues()

    this.subscriber.consume<IPromotionCreated>(
      { name: 'PromotionSync/PromotionRegistered'}, 
      (data):Promise<void>=>{
        this.syncPromotionRegistered(data)
        return
      }
    )

    this.subscriber.consume<IPromotionBundlesUpdated>(
      { name: 'PromotionSync/PromotionUpdatedBundles'}, 
      (data):Promise<void>=>{
        this.syncPromotionUpdated(data)
        return
      }
    )

    this.subscriber.consume<IPromotionDescriptionUpdated>(
      { name: 'PromotionSync/PromotionUpdatedDescription'}, 
      (data):Promise<void>=>{
        this.syncPromotionUpdated(data)
        return
      }
    )

    this.subscriber.consume<IPromotionDiscountUpdated>(
      { name: 'PromotionSync/PromotionUpdatedDiscount'}, 
      (data):Promise<void>=>{
        this.syncPromotionUpdated(data)
        return
      }
    )

    this.subscriber.consume<IPromotionNameUpdated>(
      { name: 'PromotionSync/PromotionUpdatedName'}, 
      (data):Promise<void>=>{
        this.syncPromotionUpdated(data)
        return
      }
    )

    this.subscriber.consume<IPromotionProductsUpdated>(
      { name: 'PromotionSync/PromotionUpdatedProducts'}, 
      (data):Promise<void>=>{
        this.syncPromotionUpdated(data)
        return
      }
    )

    this.subscriber.consume<IPromotionStateUpdated>(
      { name: 'PromotionSync/PromotionUpdatedState'}, 
      (data):Promise<void>=>{
        this.syncPromotionUpdated({...data,promotionState:data.promotionState.state})
        return
      }
    )
  }

  async syncPromotionRegistered(data:IPromotionCreated){
    let service= new PromotionRegisteredSyncroniceService(this.mongoose)
    await service.execute(data)
  }

  async syncPromotionUpdated(data:PromotionUpdatedInfraestructureRequestDTO){
    let service= new PromotionUpdatedSyncroniceService(this.mongoose)
    await service.execute(data)
  }

  @ApiResponse({
    status: 200,
    description: 'Create promotion',
    type: CreatePromotionInfraestructureResponseDTO,
  })
  @Post('create')
  async createPromotion(
    @GetCredential() credential:ICredential,
    @Body() entry: CreatePromotionInfraestructureRequestDTO
  ){
    if(!entry.bundles) entry.bundles=[]
    if(!entry.products) entry.products=[]

    let service= new ExceptionDecorator(
      new AuditDecorator(
        new PerformanceDecorator(
          new CreatePromotionApplicationService(
            this.ormPromotionCommandRepo,
            this.odmPromotionQueryRepo,
            this.odmQueryProductRepo,
            this.odmQueryBundleRepo,
            this.idGen,
            new RabbitMQPublisher(this.channel),
          ),new NestTimer(),new NestLogger(new Logger())
        ),this.auditRepository,new DateHandler()
      )
    )
    let response=await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }

  @ApiResponse({
    status: 200,
    description: 'find all promotions',
    type: FindAllPromotionInfraestructureResponseDTO,
  })
  @Get('many')
  async getAllProducts(
    @GetCredential() credential:ICredential,
    @Query() entry:FindAllPromotionInfraestructureRequestDTO
  ){
    if(!entry.page)
      entry.page=1
    if(!entry.perpage)
      entry.perpage=10
    if(!entry.term)
      entry.term=''

    const pagination:PaginationRequestDTO={userId:credential.account.idUser,page:entry.page, perPage:entry.perpage}

    let service= new ExceptionDecorator(
        new LoggerDecorator(
          new PerformanceDecorator(
            new FindAllPromotionApplicationService(
              this.odmPromotionQueryRepo
            ),new NestTimer(),new NestLogger(new Logger())
          ),new NestLogger(new Logger())
        )
      )
    let response= await service.execute({...pagination,name:entry.term})
    return response.getValue
  }

  @ApiResponse({
    status: 200,
    description: 'find promotion by id',
    type: FindPromotionByIdInfraestructureResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getPromotionById(
    @GetCredential() credential:ICredential,
    @Param() entry:FindPromotionByIdInfraestructureRequestDTO
  ){

    let service= new ExceptionDecorator(
      new LoggerDecorator(
        new PerformanceDecorator(
          new FindPromotionByIdApplicationService(
            this.odmPromotionQueryRepo
          ),new NestTimer(),new NestLogger(new Logger())
        ),new NestLogger(new Logger())
      )
    )
    
    let response= await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }

    @UseGuards(JwtAuthGuard)
    @Patch('update/:id')
    async updatePromotion(
      @GetCredential() credential:ICredential,
      @Param() entryId:ByIdDTO,
      @Body() entry:UpdatePromotionInfraestructureRequestDTO,
    ){
      let service= new ExceptionDecorator(
        new SecurityDecorator(
            new PerformanceDecorator(
              new UpdatePromotionApplicationService(
                this.ormPromotionCommandRepo,
                this.odmPromotionQueryRepo,
                this.odmQueryProductRepo,
                this.odmQueryBundleRepo,
                new RabbitMQPublisher(this.channel)
              ),new NestTimer(),new NestLogger(new Logger())
          ),credential,[UserRoles.ADMIN])
        )
  
      let response= await service.execute({
        ...entry,
        userId:credential.account.idUser,
        id:entryId.id
      })
      return response.getValue
    }
}
