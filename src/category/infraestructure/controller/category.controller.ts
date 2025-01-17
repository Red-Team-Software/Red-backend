import { Body, Controller, Delete, FileTypeValidator, Get, Inject, Logger, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ICategoryRepository } from 'src/category/domain/repository/category-repository.interface';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateCategoryInfrastructureRequestDTO } from '../dto-request/create-category-infrastructure-request.dto';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { CreateCategoryApplication } from 'src/category/application/services/command/create-category-application';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { CloudinaryService } from 'src/common/infraestructure/file-uploader/cloudinary-uploader';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FindAllCategoriesApplicationService } from 'src/category/application/services/query/find-all-categories-application';
import { PaginationRequestDTO } from 'src/common/application/services/dto/request/pagination-request-dto';
import { RabbitMQPublisher } from 'src/common/infraestructure/events/publishers/rabbit-mq-publisher';
import { Channel } from 'amqplib';
import { IQueryCategoryRepository } from 'src/category/application/query-repository/query-category-repository';
import { OrmCategoryQueryRepository } from '../repositories/orm-repository/orm-category-query-repository';
import { FindAllCategoriesInfraestructureRequestDTO } from '../dto-request/find-all-categories-infraestructure-request-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteCategoryApplication } from 'src/category/application/services/command/delete-category-application';
import { ICredential } from 'src/auth/application/model/credential.interface';
import { GetCredential } from 'src/auth/infraestructure/jwt/decorator/get-credential.decorator';
import { credential } from 'firebase-admin';
import { FindCategoryByProductIdInfraestructureRequestDTO } from '../dto-request/find-category-by-productid-infrastructure-request.dto';
import { FindCategoryByIdApplicationService } from 'src/category/application/services/query/find-category-by-id-application';
import { FindCategoryByProductIdApplicationService } from 'src/category/application/services/query/find-category-by-product-id-application';
import { PerformanceDecorator } from 'src/common/application/aspects/performance-decorator/performance-decorator';
import { NestTimer } from 'src/common/infraestructure/timer/nets-timer';
import { FindCategoryByIdInfraestructureRequestDTO } from '../dto-request/find-category-by-id-infraestructure-request.dto';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/guards/jwt-auth.guard';
import { FindCategoryByBundleIdApplicationService } from 'src/category/application/services/query/find-category-by-bundle-id-application';
import { FindCategoryByBundleIdInfraestructureRequestDTO } from '../dto-request/find-category-by-bundle-id-infrastructure-request.dto';
import { SecurityDecorator } from 'src/common/application/aspects/security-decorator/security-decorator';
import { UserRoles } from 'src/user/domain/value-object/enum/user.roles';
import { DeleteCategoryByIdInfraestructureRequestDTO } from '../dto-request/delte-category-infraestructure-request-dto';
import { UpdateCategoryApplicationService } from 'src/category/application/services/command/update-category-application';
import { ByIdDTO } from 'src/common/infraestructure/dto/entry/by-id.dto';
import { UpdateCategoryInfraestructureRequestDTO } from '../dto-request/update-category-infraestructure-request-dto';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { OrmBundleQueryRepository } from 'src/bundle/infraestructure/repositories/orm-repository/orm-bundle-query-repository';
import { OrmProductQueryRepository } from 'src/product/infraestructure/repositories/orm-repository/orm-product-query-repository';
import { CategoryQueues } from '../queues/category.queues';
import { RabbitMQSubscriber } from 'src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber';
import { ICategoryCreated } from '../interfaces/category-created.interface';
import { CategoryRegisteredSyncroniceService } from '../services/syncronice/category-registered-syncronice.service';
import { Mongoose } from 'mongoose';
import { OdmProductQueryRepository } from 'src/product/infraestructure/repositories/odm-repository/odm-product-query-repository';
import { OdmCategoryQueryRepository } from '../repositories/odm-repository/odm-query-category-repository';
import { OdmBundleQueryRepository } from 'src/bundle/infraestructure/repositories/odm-repository/odm-bundle-query-repository';
import { OrmCategoryRepository } from '../repositories/orm-repository/category-typeorm-repository';
import { ICategoryBundleUpdated } from '../interfaces/category-bundle-update.interface';
import { CategoryUpdatedInfraestructureRequestDTO } from '../services/dto/request/category-updated-infraestructure-request-dto';
import { CategoryUpdatedSyncroniceService } from '../services/syncronice/category-updated-syncronice.service';
import { ICategoryNameUpdated } from '../interfaces/category-name-update.interface';
import { ICategoryImageUpdated } from '../interfaces/category-image-update.interface';
import { ICategoryProductUpdated } from '../interfaces/category-product-update.interface';

@Controller('category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags("Category")
export class CategoryController {

  private readonly ormCommandCategoryRepo: ICategoryRepository
  private readonly idGen: IIdGen<string>
  private readonly ormCategoryQueryRepo: IQueryCategoryRepository
  private readonly ormQueryCategoryRepo: IQueryCategoryRepository
  private readonly ormQueryBundleRepo:IQueryBundleRepository
  private readonly ormQueryProductRepo:IQueryProductRepository
  private readonly subscriber:RabbitMQSubscriber
  private readonly odmQueryProductRepo:IQueryProductRepository
  private readonly odmQueryCategoryRepo: IQueryCategoryRepository
  private readonly odmQueryBundleRepo:IQueryBundleRepository
  


    private initializeQueues():void{        
      CategoryQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
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
    this.idGen = new UuidGen();
    this.ormCommandCategoryRepo = new OrmCategoryRepository(PgDatabaseSingleton.getInstance())
    this.ormCategoryQueryRepo = new OrmCategoryQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryBundleRepo=new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryProductRepo=new OrmProductQueryRepository(PgDatabaseSingleton.getInstance())
    this.odmQueryProductRepo = new OdmProductQueryRepository(mongoose)
    this.odmQueryCategoryRepo= new OdmCategoryQueryRepository(mongoose)
    this.odmQueryBundleRepo= new OdmBundleQueryRepository(mongoose)
    this.subscriber= new RabbitMQSubscriber(this.channel)

    this.initializeQueues()

    this.subscriber.consume<ICategoryCreated>(
        { name: 'CategorySync/CategoryCreated'}, 
        (data):Promise<void>=>{
          this.syncCategoryRegistered(data)
          return
        }
    )

    this.subscriber.consume<ICategoryBundleUpdated>(
      { name: 'CategorySync/CategoryUpdatedBundles' },
      (data):Promise<void>=>{
        this.syncCategoryUpdated({...data})
        return
      }
    )

    this.subscriber.consume<ICategoryImageUpdated>(
      { name: 'CategorySync/CategoryUpdatedImage' },
      (data):Promise<void>=>{
        this.syncCategoryUpdated({...data})
        return
      }
    )

    this.subscriber.consume<ICategoryNameUpdated>(
      { name: 'CategorySync/CategoryUpdatedName'},
      (data):Promise<void>=>{
        this.syncCategoryUpdated({...data})
        return
      }
    )

    this.subscriber.consume<ICategoryProductUpdated>(
      { name: 'CategorySync/CategoryUpdatedProducts'},
      (data):Promise<void>=>{
        this.syncCategoryUpdated({...data})
        return
      }
    )
  }

  async syncCategoryRegistered(data:ICategoryCreated){
    let service= new CategoryRegisteredSyncroniceService(this.mongoose)
    await service.execute(data)
    console.log('llamo a create')
  }

  async syncCategoryUpdated(data:CategoryUpdatedInfraestructureRequestDTO){
    console.log('data de afuera',data)
    let service= new CategoryUpdatedSyncroniceService(this.mongoose)
    let response=await service.execute({...data})
    console.log(response)

  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @GetCredential() credential:ICredential,
    @Body() entry: CreateCategoryInfrastructureRequestDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png)$/,
          }),
        ],
      })
    ) image: Express.Multer.File
  ) {

    if(!entry.bundles) entry.bundles=[]
    if(!entry.products) entry.products=[]

    let service = new ExceptionDecorator(
      new CreateCategoryApplication(
        new RabbitMQPublisher(this.channel),
        this.ormCommandCategoryRepo,
        this.odmQueryCategoryRepo,
        this.odmQueryProductRepo,
        this.odmQueryBundleRepo,
        this.idGen,
        new CloudinaryService()
      )
    );

    const buffer = image.buffer;
    const response = await service.execute({ 
      userId: credential.account.idUser, 
      name:entry.name,
      products:entry.products,
      bundles:entry.bundles,
      image: buffer });
    return response.getValue
  }

  @Get('many')
  async getAllCategories(
    @GetCredential() credential:ICredential,
    @Query() entry: FindAllCategoriesInfraestructureRequestDTO) {
    if (!entry.page) entry.page = 1;
    if (!entry.perpage) entry.perpage = 10;

    const pagination: PaginationRequestDTO = { userId: credential.account.idUser, page: entry.page, perPage: entry.perpage };

    let service = new ExceptionDecorator(
      new LoggerDecorator(
        new FindAllCategoriesApplicationService(this.odmQueryCategoryRepo),
        new NestLogger(new Logger())
      )
    );

    const response = await service.execute({ ...pagination });
    return response.getValue
  }
  
// @Get('Category')
//  async getCategoryById()

  @Get('categorybyproductid/:id')
  async getCategoryByProductId(
    @GetCredential() credential:ICredential,
    @Param() entry: FindCategoryByProductIdInfraestructureRequestDTO
  ){
    let service= new ExceptionDecorator(
      new LoggerDecorator(
          new FindCategoryByProductIdApplicationService(
            this.odmQueryCategoryRepo
          )
        ,new NestLogger(new Logger())
      )
    )
    
    let response= await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }

  @Get('categorybybundleid/:id')
  async getCategoryByBundleId(
    @GetCredential() credential: ICredential,
    @Param() entry: FindCategoryByBundleIdInfraestructureRequestDTO
  ) {
  let service = new ExceptionDecorator(
    new LoggerDecorator(
      new FindCategoryByBundleIdApplicationService(
        this.odmQueryCategoryRepo
      ),
      new NestLogger(new Logger())
    )
  );

  let response = await service.execute({ userId: credential.account.idUser, ...entry });
  return response.getValue;
}

  @Get(':id')
  async getProductById(
    @GetCredential() credential:ICredential,
    @Param() entry:FindCategoryByIdInfraestructureRequestDTO
  ){

    let service= new ExceptionDecorator(
      new LoggerDecorator(
        new PerformanceDecorator(
          new FindCategoryByIdApplicationService(
            this.odmQueryCategoryRepo
          ),new NestTimer(),new NestLogger(new Logger())
        ),new NestLogger(new Logger())
      )
    )
    
    let response= await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteCategory(
    @GetCredential() credential:ICredential,
    @Param() entry:DeleteCategoryByIdInfraestructureRequestDTO) {
    
    let service = new ExceptionDecorator(
      new SecurityDecorator(
        new LoggerDecorator(
          new PerformanceDecorator(
            new DeleteCategoryApplication(
              this.ormCommandCategoryRepo,
              this.odmQueryCategoryRepo,
              new RabbitMQPublisher(this.channel),
              new CloudinaryService()
            ),
            new NestTimer(),new NestLogger(new Logger())
          ),new NestLogger(new Logger())
        ),credential,[UserRoles.ADMIN])
      )

    const response = await service.execute({ userId:credential.account.idUser,...entry });
    return response.getValue
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))  
  async updateCategory(
    @GetCredential() credential: ICredential,
    @Param() entryId: ByIdDTO,
    @Body() entry: UpdateCategoryInfraestructureRequestDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpeg|.jpg|.png)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    ) image?: Express.Multer.File,
  ) {
    let service = new ExceptionDecorator(
      new SecurityDecorator(
        new PerformanceDecorator(
          new UpdateCategoryApplicationService(
            new RabbitMQPublisher(this.channel),
            this.ormCommandCategoryRepo,
            this.odmQueryCategoryRepo,
            new CloudinaryService(),
            new UuidGen(),
          ),
          new NestTimer(),
          new NestLogger(new Logger()),
        ),
        credential,
        [UserRoles.ADMIN],
      ),
    );
    
    const buffer = image ? image.buffer : null;

    const response = await service.execute({
      ...entry,
      userId: credential.account.idUser,
      categoryId: entryId.id,
      image: buffer,
    });
    
    return response.getValue;
  }
}