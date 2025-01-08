import { Body, Controller, Delete, FileTypeValidator, Get, Inject, Logger, Param, ParseFilePipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrmProductRepository } from '../repositories/orm-repository/orm-product-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateProductInfraestructureRequestDTO } from '../dto-request/create-product-infraestructure-request-dto';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { CreateProductApplicationService } from 'src/product/application/services/command/create-product-application.service';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { CloudinaryService } from 'src/common/infraestructure/file-uploader/cloudinary-uploader';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { OrmProductQueryRepository } from '../repositories/orm-repository/orm-product-query-repository';
import { FindAllProductsApplicationService } from 'src/product/application/services/query/find-all-products-application.service';
import { FindAllProductsInfraestructureRequestDTO } from '../dto-request/find-all-products-infraestructure-request-dto';
import { Channel } from 'amqplib';
import { FindAllProductsAndBundlesInfraestructureRequestDTO } from '../dto-request/find-all-products-and-bundles-infraestructure-request-dto';
import { FindAllProductsAndComboApplicationService } from 'src/product/application/services/query/find-all-product-and-combo-by-name-application.service';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { OrmBundleQueryRepository } from 'src/bundle/infraestructure/repositories/orm-repository/orm-bundle-query-repository';
import { FindAllProductsbyNameApplicationRequestDTO } from 'src/product/application/dto/request/find-all-products-and-combos-application-request-dto';
import { FindProductByIdInfraestructureRequestDTO } from '../dto-request/find-product-by-id-infraestructure-request-dto';
import { FindProductByIdApplicationService } from 'src/product/application/services/query/find-product-by-id-application.service';
import { RabbitMQPublisher } from 'src/common/infraestructure/events/publishers/rabbit-mq-publisher';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/guards/jwt-auth.guard';
import { ICredential } from 'src/auth/application/model/credential.interface';
import { GetCredential } from 'src/auth/infraestructure/jwt/decorator/get-credential.decorator';
import { PerformanceDecorator } from 'src/common/application/aspects/performance-decorator/performance-decorator';
import { AuditDecorator } from 'src/common/application/aspects/audit-decorator/audit-decorator';
import { IAuditRepository } from 'src/common/application/repositories/audit.repository';
import { OrmAuditRepository } from 'src/common/infraestructure/repository/orm-repository/orm-audit.repository';
import { DateHandler } from 'src/common/infraestructure/date-handler/date-handler';
import { NestTimer } from 'src/common/infraestructure/timer/nets-timer';
import { ICommandProductRepository } from 'src/product/domain/repository/product.command.repositry.interface';
import { SecurityDecorator } from 'src/common/application/aspects/security-decorator/security-decorator';
import { UserRoles } from 'src/user/domain/value-object/enum/user.roles';
import { DeleteProductByIdInfraestructureRequestDTO } from '../dto-request/delete-product-by-id-infraestructure-request-dto';
import { DeleteProductApplicationService } from 'src/product/application/services/command/delete-product-application.service';
import { ByIdDTO } from 'src/common/infraestructure/dto/entry/by-id.dto';
import { UpdateProductInfraestructureRequestDTO } from '../dto-request/update-product-infraestructure-request-dto';
import { UpdateProductApplicationService } from 'src/product/application/services/command/update-product-application.service';
import { RabbitMQSubscriber } from 'src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber';
import { ProductQueues } from '../queues/product.queues';
import { ICreateOrder } from '../interfaces/create-order.interface';
import { AdjustProductStockApplicationService } from 'src/product/application/services/command/adjust-product-stock-application.service';
import { FindAllProductsApplicationRequestDTO } from 'src/product/application/dto/request/find-all-products-application-request-dto';
import { OdmProductQueryRepository } from '../repositories/odm-repository/odm-product-query-repository';
import { Mongoose } from 'mongoose';
import { OdmProductCommandRepository } from '../repositories/odm-repository/odm-product-command-repository';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { ProductRegisteredSyncroniceService } from '../services/syncronice/product-registered-syncronice.service';
import { IProductUpdatedCaducityDate } from '../interfaces/product-updated-caducity-date.interface';
import { IProductUpdatedDescription } from '../interfaces/product-updated-description.interface';
import { IProductUpdatedImages } from '../interfaces/product-updated-images.interface';
import { IProductUpdatedName } from '../interfaces/product-updated-name.interface';
import { IProductUpdatedPrice } from '../interfaces/product-updated-price.interface';
import { IProductUpdatedStock } from '../interfaces/product-updated-stock.interface';
import { IProductUpdatedWeigth } from '../interfaces/product-updated-weigth.interface';
import { ProductUpdatedInfraestructureRequestDTO } from '../services/dto/request/product-updated-infraestructure-request-dto';
import { ProductUpdatedSyncroniceService } from '../services/syncronice/product-updated-syncronice.service';
import { IProductDeleted } from '../interfaces/product-deleted.interface';
import { ProductDeletedSyncroniceService } from '../services/syncronice/product-deleted-syncronice.service';
import { IBundleDeleted } from 'src/bundle/infraestructure/interfaces/bundle-deleted.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Product')
@Controller('product')
export class ProductController {

  private readonly idGen: IIdGen<string> 
  private readonly ormCommandProductRepo:ICommandProductRepository
  private readonly ormQueryProductRepo:IQueryProductRepository
  private readonly ormBundleQueryRepo:IQueryBundleRepository
  private readonly auditRepository: IAuditRepository
  private readonly subscriber: RabbitMQSubscriber
  private readonly odmProductQueryRepo:IQueryProductRepository
  private readonly odmCommandProductRepo:ICommandProductRepository


  private initializeQueues():void{        
    ProductQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
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
    this.ormCommandProductRepo= new OrmProductRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryProductRepo= new OrmProductQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormBundleQueryRepo= new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance())
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
    this.subscriber= new RabbitMQSubscriber(this.channel)

    this.odmProductQueryRepo= new OdmProductQueryRepository(mongoose)
    this.odmCommandProductRepo=new OdmProductCommandRepository(mongoose)
    
    this.initializeQueues()


    this.subscriber.consume<ICreateOrder>(
        { name: 'ProductReduce/OrderRegistered'}, 
        (data):Promise<void>=>{
          this.reduceProductStock(data)
          return
        }
    )

    this.subscriber.consume<ICreateProduct>(
      { name: 'ProductSync/ProductRegistered'}, 
      (data):Promise<void>=>{
        this.syncProductRegistered(data)
        return
      }
  )

    this.subscriber.consume<IProductUpdatedCaducityDate>(
      { name: 'ProductSync/ProductUpdatedCaducityDate'}, 
      (data):Promise<void>=>{
        this.syncProductUpdated({
          ...data,
          productCaducityDate:new Date(data.productCaducityDate)})
        return
      }
    )

    this.subscriber.consume<IProductUpdatedDescription>(
      { name: 'ProductSync/ProductUpdatedDescription'}, 
      (data):Promise<void>=>{
        this.syncProductUpdated({...data})
        return
      }
    )

    this.subscriber.consume<IProductUpdatedImages>(
      { name: 'ProductSync/ProductUpdatedImages'}, 
      (data):Promise<void>=>{
        this.syncProductUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IProductUpdatedName>(
      { name: 'ProductSync/ProductUpdatedName'}, 
      (data):Promise<void>=>{
        this.syncProductUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IProductUpdatedPrice>(
      { name: 'ProductSync/ProductUpdatedPrice'}, 
      (data):Promise<void>=>{
        this.syncProductUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IProductUpdatedStock>(
      { name: 'ProductSync/ProductUpdatedStock'}, 
      (data):Promise<void>=>{
        this.syncProductUpdated(data)
        return
      }
    )
    
    this.subscriber.consume<IProductUpdatedWeigth>(
      { name: 'ProductSync/ProductUpdatedWeigth'}, 
      (data):Promise<void>=>{
        this.syncProductUpdated(data)
        return
      }
    )

    this.subscriber.consume<IBundleDeleted>(
      { name: 'ProductSync/ProductDeleted'}, 
      (data):Promise<void>=>{
        this.syncProductDeleted({productId:data.bundleId})
        return
      }
    )
  }

  async reduceProductStock (data:ICreateOrder){

    if(data.products.length==0)
      return

    console.log(data)

    let service= new ExceptionDecorator(
      new AuditDecorator(
          new PerformanceDecorator(
            new AdjustProductStockApplicationService(
              new RabbitMQPublisher(this.channel),
              this.ormCommandProductRepo,
              this.ormQueryProductRepo
            ),new NestTimer(),new NestLogger(new Logger())
        ),this.auditRepository,new DateHandler()
      )
    )
    await service.execute({userId:data.orderUserId,products:data.products})
  }

  async syncProductRegistered(data:ICreateProduct){
    let service= new ProductRegisteredSyncroniceService(this.mongoose)
    await service.execute(data)
  }

  async syncProductDeleted(data:IProductDeleted){
    let service= new ProductDeletedSyncroniceService(this.mongoose)
    await service.execute(data)
  }

  async syncProductUpdated(data:ProductUpdatedInfraestructureRequestDTO){
    let service= new ProductUpdatedSyncroniceService(this.mongoose)
    await service.execute({...data})
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FilesInterceptor('images'))  
  async createProduct(
    @GetCredential() credential:ICredential,
    @Body() entry: CreateProductInfraestructureRequestDTO,
    @UploadedFiles(
    new ParseFilePipe({
      validators: [new FileTypeValidator({
        fileType:/(jpeg|.jpg|.png)$/
      }),
      ]
    }),
  ) images: Express.Multer.File[]) {

    let service=
    new ExceptionDecorator(
      new SecurityDecorator(
        new AuditDecorator(
          new PerformanceDecorator(
            new CreateProductApplicationService(
              new RabbitMQPublisher(this.channel),
              this.ormCommandProductRepo,
              this.ormQueryProductRepo,
              this.idGen,
              new CloudinaryService()
            ),new NestTimer(),new NestLogger(new Logger())
          ),this.auditRepository,new DateHandler()
        ),
        credential,[UserRoles.ADMIN])
      )
      let buffers=images.map(image=>image.buffer)
    let response= await service.execute({userId:credential.account.idUser,...entry,images:buffers})
    return response.getValue
  }

  @UseGuards(JwtAuthGuard)
  @Get('many')
  async getAllProducts(
    @GetCredential() credential:ICredential,
    @Query() entry:FindAllProductsInfraestructureRequestDTO
  ){
    if(!entry.page)
      entry.page=1
    if(!entry.perPage)
      entry.perPage=10

    const pagination:FindAllProductsApplicationRequestDTO={
      userId:credential.account.idUser,
      page:entry.page,
      perPage:entry.perPage,
      ...entry
    }

    let service= new ExceptionDecorator(
        new LoggerDecorator(
          new PerformanceDecorator(
            new FindAllProductsApplicationService(
              this.ormQueryProductRepo
            ),new NestTimer(),new NestLogger(new Logger())
          ),new NestLogger(new Logger())
        )
      )
    let response= await service.execute({...pagination})
    return response.getValue
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all-product-bundle')
  async getAllProductsAndBundles(
    @GetCredential() credential:ICredential,
    @Query() entry:FindAllProductsAndBundlesInfraestructureRequestDTO
  ){
    if(!entry.page)
      entry.page=1
    if(!entry.perPage)
      entry.perPage=10

    const pagination:FindAllProductsbyNameApplicationRequestDTO={
      userId:credential.account.idUser,
      page:entry.page, 
      perPage:entry.perPage,
      name:entry.term
    }

    let service= new ExceptionDecorator(
      new LoggerDecorator(
        new PerformanceDecorator(
          new FindAllProductsAndComboApplicationService(
            this.ormQueryProductRepo,
            this.ormBundleQueryRepo
          ),new NestTimer(),new NestLogger(new Logger())
        ),new NestLogger(new Logger())
      )
    )
    let response= await service.execute({...pagination})
    return response.getValue
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getProductById(
    @GetCredential() credential:ICredential,
    @Param() entry:FindProductByIdInfraestructureRequestDTO
  ){
    let service= new ExceptionDecorator(
      new LoggerDecorator(
        new PerformanceDecorator(
          new FindProductByIdApplicationService(
            this.ormQueryProductRepo
          ),new NestTimer(),new NestLogger(new Logger())
        ),new NestLogger(new Logger())
      )
    )
    
    let response= await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deletetProductById(
    @GetCredential() credential:ICredential,
    @Param() entry:DeleteProductByIdInfraestructureRequestDTO
  ){
    let service= new ExceptionDecorator(
      new AuditDecorator(
        new SecurityDecorator(
            new LoggerDecorator(
              new PerformanceDecorator(
                new DeleteProductApplicationService(
                  new RabbitMQPublisher(this.channel),
                  this.ormCommandProductRepo,
                  this.ormQueryProductRepo,
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

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @UseInterceptors(FilesInterceptor('images'))  
  async updateProduct(
    @GetCredential() credential:ICredential,
    @Param() entryId:ByIdDTO,
    @Body() entry:UpdateProductInfraestructureRequestDTO,
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
              new UpdateProductApplicationService(
                new RabbitMQPublisher(this.channel),
                this.ormCommandProductRepo,
                this.ormQueryProductRepo,
                new CloudinaryService(),
                new UuidGen()              
              ),new NestTimer(),new NestLogger(new Logger())
          ),credential,[UserRoles.ADMIN]),
        this.auditRepository,new DateHandler()
      )
    )
    let buffers=images ? images.map(image=>image.buffer) : null

    let response= await service.execute({
      ...entry,
      userId:credential.account.idUser,
      productId:entryId.id,
      images:buffers})
    return response.getValue
  }
}
