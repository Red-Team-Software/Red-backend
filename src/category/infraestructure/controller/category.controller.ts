import { Body, Controller, Delete, FileTypeValidator, Get, Inject, Logger, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ICategoryCommandRepository } from 'src/category/domain/repository/category-command-repository.interface';
import { OrmCategoryCommandRepository } from '../repositories/category-typeorm-repository';
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
import { OrmCategoryQueryRepository } from '../repositories/orm-category-query-repository';
import { FindAllCategoriesInfraestructureRequestDTO } from '../dto-request/find-all-categories-infraestructure-request-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteCategoryApplication } from 'src/category/application/services/command/delete-category-application';
import { ICredential } from 'src/auth/application/model/credential.interface';
import { GetCredential } from 'src/auth/infraestructure/jwt/decorator/get-credential.decorator';
import { credential } from 'firebase-admin';
import { FindCategoryByProductIdApplicationRequestDTO } from 'src/category/application/dto/request/find-category-by-productid-application-request.dto';
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
import { DeleteCategoryByIdInfraestructureRequestDTO } from '../dto-request/delete-category-infraestructure-request-dto';
import { UpdateCategoryApplicationService } from 'src/category/application/services/command/update-category-application';
import { ByIdDTO } from 'src/common/infraestructure/dto/entry/by-id.dto';
import { UpdateCategoryInfraestructureRequestDTO } from '../dto-request/update-category-infraestructure-request-dto';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { OrmBundleQueryRepository } from 'src/bundle/infraestructure/repositories/orm-repository/orm-bundle-query-repository';
import { OrmProductQueryRepository } from 'src/product/infraestructure/repositories/orm-repository/orm-product-query-repository';
import { AddProductToCategoryInfraestructureRequestDTO } from '../dto-request/add-product-to-category-infraestructure-request.dto';
import { AddBundleToCategoryInfraestructureRequestDTO } from '../dto-request/add-bundle-to-category-infraestructure-request.dto';
import { AddProductToCategoryApplicationService } from 'src/category/application/services/command/add-product-to-category-application-service';
import { AddBundleToCategoryApplicationService } from 'src/category/application/services/command/add-bundle-to-category-application-service';
import { DateHandler } from 'src/common/infraestructure/date-handler/date-handler';
import { IAuditRepository } from 'src/common/application/repositories/audit.repository';
import { AuditDecorator } from 'src/common/application/aspects/audit-decorator/audit-decorator';
import { OrmAuditRepository } from 'src/common/infraestructure/repository/orm-repository/orm-audit.repository';

@Controller('category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags("Category")
export class CategoryController {

  private readonly ormCategoryCommandRepo: ICategoryCommandRepository
  private readonly idGen: IIdGen<string>
  private readonly ormCategoryQueryRepo: IQueryCategoryRepository
  private readonly ormQueryBundleRepo:IQueryBundleRepository
  private readonly ormQueryProductRepo:IQueryProductRepository
  private readonly auditRepository: IAuditRepository
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen = new UuidGen();
    this.ormCategoryCommandRepo = new OrmCategoryCommandRepository(PgDatabaseSingleton.getInstance())
    this.ormCategoryQueryRepo = new OrmCategoryQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryBundleRepo=new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryProductRepo=new OrmProductQueryRepository(PgDatabaseSingleton.getInstance())
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())

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
    console.log('Incoming request body:', entry);

    if(!entry.bundles) entry.bundles=[]
    if(!entry.products) entry.products=[]

    let service = new ExceptionDecorator(
      new CreateCategoryApplication(
        new RabbitMQPublisher(this.channel),
        this.ormCategoryCommandRepo,
        this.ormCategoryQueryRepo,
        this.ormQueryProductRepo,
        this.ormQueryBundleRepo,
        this.idGen,
        new CloudinaryService()
      )
    );

    const buffer = image.buffer;
    const response = await service.execute({ userId: credential.account.idUser, ...entry, image: buffer });
    return response.getValue
  }

  @Get('many')
  async getAllCategories(
    @GetCredential() credential:ICredential,
    @Query() entry: FindAllCategoriesInfraestructureRequestDTO) {
    if (!entry.page) entry.page = 1;
    if (!entry.perPage) entry.perPage = 10;

    const pagination: PaginationRequestDTO = { userId: credential.account.idUser, page: entry.page, perPage: entry.perPage };

    let service = new ExceptionDecorator(
      new LoggerDecorator(
        new FindAllCategoriesApplicationService(this.ormCategoryQueryRepo),
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
            this.ormCategoryQueryRepo
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
        this.ormCategoryQueryRepo
      ),
      new NestLogger(new Logger())
    )
  );

  let response = await service.execute({ userId: credential.account.idUser, ...entry });
  return response.getValue;
}

  @Get(':id')
  async getCategoryById(
    @GetCredential() credential:ICredential,
    @Param() entry:FindCategoryByIdInfraestructureRequestDTO
  ){

    let service= new ExceptionDecorator(
      new LoggerDecorator(
        new PerformanceDecorator(
          new FindCategoryByIdApplicationService(
            this.ormCategoryQueryRepo
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
      new AuditDecorator(
        new SecurityDecorator(
          new LoggerDecorator(
            new PerformanceDecorator(
              new DeleteCategoryApplication(this.ormCategoryCommandRepo,this.ormCategoryQueryRepo, new RabbitMQPublisher(this.channel),new CloudinaryService()),
              new NestTimer(),new NestLogger(new Logger())
            ),new NestLogger(new Logger())
          ),credential,[UserRoles.ADMIN]), this.auditRepository, new DateHandler()
        )
      )

    const response = await service.execute({ userId:credential.account.idUser,...entry });
    return response.getValue
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @UseInterceptors(FilesInterceptor('images'))  
  async updateCategory(
    @GetCredential() credential: ICredential,
    @Param() entryId: ByIdDTO,
    @Body() entry: UpdateCategoryInfraestructureRequestDTO,
    @UploadedFiles(
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
            this.ormCategoryCommandRepo,
            this.ormCategoryQueryRepo,
            new CloudinaryService(),
            new UuidGen()
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

  @UseGuards(JwtAuthGuard)
  @Patch('add-product/:id')
  async addProductToCategory(
    @GetCredential() credential: ICredential,
    @Param() entryId: ByIdDTO,
    @Body() entry: AddProductToCategoryInfraestructureRequestDTO,
  ) {
    let service = new ExceptionDecorator(
      new SecurityDecorator(
        new PerformanceDecorator(
          new AddProductToCategoryApplicationService(
            this.ormCategoryCommandRepo,
            this.ormCategoryQueryRepo,
            this.ormQueryProductRepo,
            new RabbitMQPublisher(this.channel),
          ),
          new NestTimer(),
          new NestLogger(new Logger()),
        ),
        credential,
        [UserRoles.ADMIN],
      ),
    );

    const response = await service.execute({
      userId: credential.account.idUser,
      categoryId: entryId.id,
      productId: entry.productId,
    });

    return response.getValue;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add-bundle/:id')
  async addBundleToCategory(
    @GetCredential() credential: ICredential,
    @Param() entryId: ByIdDTO,
    @Body() entry: AddBundleToCategoryInfraestructureRequestDTO,
  ) {
    let service = new ExceptionDecorator(
      new SecurityDecorator(
        new PerformanceDecorator(
          new AddBundleToCategoryApplicationService(
            this.ormCategoryCommandRepo,
            this.ormCategoryQueryRepo,
            this.ormQueryBundleRepo,
            new RabbitMQPublisher(this.channel),
          ),
          new NestTimer(),
          new NestLogger(new Logger()),
        ),
        credential,
        [UserRoles.ADMIN],
      ),
    );

    const response = await service.execute({
      userId: credential.account.idUser,
      categoryId: entryId.id,
      bundleId: entry.bundleId,
    });

    return response.getValue;
  }

}
