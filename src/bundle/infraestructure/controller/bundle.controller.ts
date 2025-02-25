import { Body, Controller, Delete, FileTypeValidator, Get, Inject, Logger, Param, ParseFilePipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { FilesInterceptor } from "@nestjs/platform-express/multer"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { CreateBundleInfraestructureRequestDTO } from "../dto-request/create-bundle-infraestructure-request-dto"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { Channel } from "amqplib"
import { CreateBundleApplicationService } from "src/bundle/application/services/command/create-bundle-application.service"
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader"
import { OrmBundleRepository } from "../repositories/orm-repository/orm-bundle-repository"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { PaginationRequestDTO } from "src/common/application/services/dto/request/pagination-request-dto"
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator"
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { OrmBundleQueryRepository } from "../repositories/orm-repository/orm-bundle-query-repository"
import { NestLogger } from "src/common/infraestructure/logger/nest-logger"
import { FindAllBundlesInfraestructureRequestDTO } from "../dto-request/find-all-bundle-infraestructure-request-dto"
import { FindAllBundlesApplicationService } from "src/bundle/application/services/query/find-all-bundles-application.service"
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto"
import { FindAllBundlesByNameInfraestructureRequestDTO } from "../dto-request/find-all-bundle-by-name-infraestructure-request-dto"
import { FindAllBundlesByNameApplicationService } from "src/bundle/application/services/query/find-all-bundles-by-name-application.service"
import { FindBundleByIdInfraestructureRequestDTO } from "../dto-request/find-bundle-by-id-infraestructure-request-dto"
import { FindBundleByIdApplicationService } from "src/bundle/application/services/query/find-bundle-by-id-application.service"
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard"
import { ICredential } from "src/auth/application/model/credential.interface"
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator"
import { IAuditRepository } from "src/common/application/repositories/audit.repository"
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository"
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator"
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator"
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler"
import { NestTimer } from "src/common/infraestructure/timer/nets-timer"
import { ICommandBundleRepository } from "src/bundle/domain/repository/bundle.command.repository.interface"
import { OrmProductQueryRepository } from "src/product/infraestructure/repositories/orm-repository/orm-product-query-repository"
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository"
import { ByIdDTO } from "src/common/infraestructure/dto/entry/by-id.dto"
import { UpdateBundleInfraestructureRequestDTO } from "../dto-request/update-bundle-infraestructure-request-dto"
import { SecurityDecorator } from "src/common/application/aspects/security-decorator/security-decorator"
import { UserRoles } from "src/user/domain/value-object/enum/user.roles"
import { UpdateBundleApplicationService } from "src/bundle/application/services/command/update-bundle-application.service"
import { DeleteBundleByIdInfraestructureRequestDTO } from "../dto-request/delete-bundle-by-id-infraestructure-request-dto"
import { DeleteBundleApplicationService } from "src/bundle/application/services/command/delete-bundle-application.service"
import { RabbitMQSubscriber } from "src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber"
import { ICreateOrder } from "../interfaces/create-order.interface"
import { AdjustBundleStockApplicationService } from "src/bundle/application/services/command/adjust-bundle-stock-application.service"
import { BundleQueues } from "../queues/bundle.queues"
import { ICreateBundle } from "../interfaces/create-bundle.interface"
import { IBundleUpdatedCaducityDate } from "../interfaces/bundle-updated-caducity-date.interface"
import { IBundleUpdatedDescription } from "../interfaces/bundle-updated-description.interface"
import { IBundleUpdatedImages } from "../interfaces/bundle-updated-images.interface"
import { IBundleUpdatedName } from "../interfaces/bundle-updated-name.interface"
import { IBundleUpdatedPrice } from "../interfaces/bundle-updated-price.interface"
import { IBundleUpdatedStock } from "../interfaces/bundle-updated-stock.interface"
import { IBundleUpdatedWeigth } from "../interfaces/bundle-updated-weigth.interface"
import { IBundleDeleted } from "../interfaces/bundle-deleted.interface"
import { BundleRegisteredSyncroniceService } from "../services/syncronice/bundle-registered-syncronice.service"
import { Mongoose } from "mongoose"
import { BundleDeletedSyncroniceService } from "../services/syncronice/bundle-deleted-syncronice.service"
import { BundleUpdatedInfraestructureRequestDTO } from "../services/dto/request/bundle-updated-infraestructure-request-dto"
import { BundleUpdatedSyncroniceService } from "../services/syncronice/bundle-updated-syncronice.service"
import { OdmBundleCommandRepository } from "../repositories/odm-repository/orm-bundle-command-repository"
import { OdmBundleQueryRepository } from "../repositories/odm-repository/odm-bundle-query-repository"
import { IBundleUpdatedProducts } from "../interfaces/bundle-updated-products.interface"
import { OdmProductQueryRepository } from "src/product/infraestructure/repositories/odm-repository/odm-product-query-repository"

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Bundle')
@Controller('bundle')
export class BundleController {

  private readonly ormBundleCommandRepo:ICommandBundleRepository
  private readonly ormQueryBundletRepo:IQueryBundleRepository
  private readonly ormQueryProductRepo:IQueryProductRepository
  private readonly idGen: IIdGen<string> 
  private readonly auditRepository: IAuditRepository
  private readonly subscriber: RabbitMQSubscriber
  private readonly odmBundleCommandRepo:ICommandBundleRepository
  private readonly odmQueryBundletRepo:IQueryBundleRepository
  private readonly odmQueryProductRepo:IQueryProductRepository

  
  private initializeQueues():void{        
    BundleQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
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
    @Inject("MONGO_CONNECTION") private readonly mongoose: Mongoose
  ) {
    this.ormBundleCommandRepo=new OrmBundleRepository(PgDatabaseSingleton.getInstance())
    this.idGen= new UuidGen()
    this.ormQueryBundletRepo=new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance())
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryProductRepo=new OrmProductQueryRepository(PgDatabaseSingleton.getInstance())
    this.subscriber= new RabbitMQSubscriber(this.channel)
    this.odmBundleCommandRepo=new OdmBundleCommandRepository(mongoose)
    this.odmQueryBundletRepo=new OdmBundleQueryRepository(mongoose)
    this.odmQueryProductRepo=new OdmProductQueryRepository(mongoose)
    

    this.initializeQueues() //TODO: REVISAR EL ERROR Y ACTIVARLO

    this.subscriber.consume<ICreateOrder>(
        { name: 'BundleReduce/OrderRegistered'}, 
        (data):Promise<void>=>{
          this.reduceBundleStock(data)
          return
        }
    )

    this.subscriber.consume<ICreateBundle>(
      { name: 'BundleSync/BundleRegistered'}, 
      (data):Promise<void>=>{
        this.syncBundleRegistered(data)
        return
      }
    )

    this.subscriber.consume<IBundleUpdatedCaducityDate>(
      { name: 'BundleSync/BundleUpdatedCaducityDate'}, 
      (data):Promise<void>=>{
        this.syncBundleUpdated({
          ...data,
          bundleCaducityDate:new Date(data.bundleCaducityDate)})
        return
      }
    )

    this.subscriber.consume<IBundleUpdatedDescription>(
      { name: 'BundleSync/BundleUpdatedDescription'}, 
      (data):Promise<void>=>{
        this.syncBundleUpdated({...data})
        return
      }
    )

    this.subscriber.consume<IBundleUpdatedImages>(
      { name: 'BundleSync/BundleUpdatedImages'}, 
      (data):Promise<void>=>{
        this.syncBundleUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IBundleUpdatedName>(
      { name: 'BundleSync/BundleUpdatedName'}, 
      (data):Promise<void>=>{
        this.syncBundleUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IBundleUpdatedPrice>(
      { name: 'BundleSync/BundleUpdatedPrice'}, 
      (data):Promise<void>=>{
        this.syncBundleUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IBundleUpdatedStock>(
      { name: 'BundleSync/BundleUpdatedStock'}, 
      (data):Promise<void>=>{
        this.syncBundleUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IBundleUpdatedWeigth>(
      { name: 'BundleSync/BundleUpdatedWeigth'}, 
      (data):Promise<void>=>{
        this.syncBundleUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IBundleUpdatedProducts>(
      { name: 'BundleSync/BundleUpdatedProducts'}, 
      (data):Promise<void>=>{
        this.syncBundleUpdated(data)
        return
      }
    )

    this.subscriber.consume<IBundleDeleted>(
      { name: 'BundleSync/BundleDeleted'}, 
      (data):Promise<void>=>{
        this.syncBundleDeleted(data)
        return
      }
    )
  }

  async syncBundleRegistered(data:ICreateBundle){
    let service= new BundleRegisteredSyncroniceService(this.mongoose)
    await service.execute(data)
  }

  async syncBundleDeleted(data:IBundleDeleted){
    let service= new BundleDeletedSyncroniceService(this.mongoose)
    await service.execute(data)
  }

  async syncBundleUpdated(data:BundleUpdatedInfraestructureRequestDTO){
    let service= new BundleUpdatedSyncroniceService(this.mongoose)
    await service.execute({...data})
  }

  async reduceBundleStock(data:ICreateOrder){
    if (data.bundles.length==0)
      return

    
    let service= new ExceptionDecorator(
      new AuditDecorator(
          new PerformanceDecorator(
            new AdjustBundleStockApplicationService(
              new RabbitMQPublisher(this.channel),
              this.ormBundleCommandRepo,
              this.odmQueryBundletRepo
            ),new NestTimer(),new NestLogger(new Logger())
        ),this.auditRepository,new DateHandler()
      )
    )

    await service.execute({userId:data.orderUserId,bundles:data.bundles})
  }
  

  @Post('create')
  @UseInterceptors(FilesInterceptor('images'))  
  async createBundle(
    @GetCredential() credential:ICredential,
    @Body() entry: CreateBundleInfraestructureRequestDTO,
    @UploadedFiles(
    new ParseFilePipe({
      validators: [new FileTypeValidator({
        fileType:/(jpeg|.jpg|.png)$/
      }),
      ]
    }),
  ) images: Express.Multer.File[]) {

    let service= new ExceptionDecorator(
      new AuditDecorator(
          new PerformanceDecorator(
            new CreateBundleApplicationService(
              new RabbitMQPublisher(this.channel),
              this.odmQueryBundletRepo,
              this.ormBundleCommandRepo,
              this.odmQueryProductRepo,
              this.idGen,
              new CloudinaryService()
            ),new NestTimer(),new NestLogger(new Logger())
          ),this.auditRepository,new DateHandler()
        )
      )
      let buffers=images.map(image=>image.buffer)
    let response= await service.execute({userId:credential.account.idUser,...entry,images:buffers})
    return response.getValue
  }

  @Get('all-name')
  async getAllBundlesByName(
    @GetCredential() credential:ICredential,
    @Query() entry:FindAllBundlesByNameInfraestructureRequestDTO
  ){
    if(!entry.page)
      entry.page=1
    if(!entry.perpage)
      entry.perpage=10

    const pagination:FindAllBundlesbyNameApplicationRequestDTO={
      userId:credential.account.idUser,
      page:entry.page,
      perPage:entry.perpage,
      name:entry.term
    }

    let service= new ExceptionDecorator(
      new LoggerDecorator(
          new PerformanceDecorator(
            new FindAllBundlesByNameApplicationService(
              this.odmQueryBundletRepo
            ),new NestTimer(), new NestLogger(new Logger())
          ),new NestLogger(new Logger())
      )
    )
  let response= await service.execute({...pagination})
  return response.getValue
  }

  @Get('many')
  async getAllBundles(
    @GetCredential() credential:ICredential,
    @Query() entry:FindAllBundlesInfraestructureRequestDTO
  ){
    if(!entry.page)
      entry.page=1
    if(!entry.perpage)
      entry.perpage=10

    const pagination:FindAllBundlesbyNameApplicationRequestDTO={
      userId:credential.account.idUser,
      page:entry.page, 
      perPage:entry.perpage,
      ...entry
    }

    let service= new ExceptionDecorator(
      new LoggerDecorator(
          new PerformanceDecorator(
            new FindAllBundlesApplicationService(
              this.odmQueryBundletRepo
            ),new NestTimer(), new NestLogger(new Logger())
          ),new NestLogger(new Logger())
      )
    )

    let response= await service.execute({...pagination})
    return response.getValue
  }

  @Get('/:id')
  async getBundleById(
    @GetCredential() credential:ICredential,
    @Param() entry:FindBundleByIdInfraestructureRequestDTO
  ){

    let service= new ExceptionDecorator(
      new LoggerDecorator(
          new PerformanceDecorator(
            new FindBundleByIdApplicationService(
              this.odmQueryBundletRepo
            ),new NestTimer(), new NestLogger(new Logger())
          ),new NestLogger(new Logger())
      )
    )
    let response= await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @UseInterceptors(FilesInterceptor('images'))  
  async updateProduct(
    @GetCredential() credential:ICredential,
    @Param() entryId:ByIdDTO,
    @Body() entry:UpdateBundleInfraestructureRequestDTO,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:/(jpeg|.jpg|.png)$/
          }),
        ],
        fileIsRequired:false
      }),
    ) images?: Express.Multer.File[]
    ){
      let service= new ExceptionDecorator(
        new AuditDecorator(
            new SecurityDecorator(
                new PerformanceDecorator(
                  new UpdateBundleApplicationService(
                    new RabbitMQPublisher(this.channel),
                    this.odmQueryBundletRepo,
                    this.ormBundleCommandRepo,
                    this.odmQueryProductRepo,
                    this.idGen,
                    new CloudinaryService()
                  ),new NestTimer(),new NestLogger(new Logger())
              ),credential,[UserRoles.ADMIN])
            ,this.auditRepository,new DateHandler()
          )
        )
      let buffers=images ? images.map(image=>image.buffer) : null
  
      let response= await service.execute({
        ...entry,
        userId:credential.account.idUser,
        bundleId:entryId.id,
        images:buffers})
      return response.getValue
    }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deletetProductById(
    @GetCredential() credential:ICredential,
    @Param() entry:DeleteBundleByIdInfraestructureRequestDTO
  ){
    let service= new ExceptionDecorator(
      new AuditDecorator(
        new SecurityDecorator(
            new LoggerDecorator(
              new PerformanceDecorator(
                new DeleteBundleApplicationService(
                  new RabbitMQPublisher(this.channel),
                  this.ormBundleCommandRepo,
                  this.odmQueryBundletRepo,
                  new CloudinaryService()              
                ),new NestTimer(),new NestLogger(new Logger())
              ),new NestLogger(new Logger())
            ),credential,[UserRoles.ADMIN])
          ,this.auditRepository,new DateHandler()
        )
      )
    
    let response= await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }
}
