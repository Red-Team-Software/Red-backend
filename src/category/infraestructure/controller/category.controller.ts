import { Body, Controller, Delete, FileTypeValidator, Get, Inject, Logger, Param, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ICategoryRepository } from 'src/category/domain/repository/category-repository.interface';
import { OrmCategoryRepository } from '../repositories/category-typeorm-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateCategoryInfrastructureRequestDTO } from '../dto-request/create-category-infrastructure-request.dto';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { CreateCategoryApplication } from 'src/category/application/services/create-category-application';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { CloudinaryService } from 'src/common/infraestructure/file-uploader/cloudinary-uploader';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindAllCategoriesApplicationService } from 'src/category/application/services/find-all-categories-application';
import { PaginationRequestDTO } from 'src/common/application/services/dto/request/pagination-request-dto';
import { RabbitMQPublisher } from 'src/common/infraestructure/events/publishers/rabbit-mq-publisher';
import { Channel } from 'amqplib';
import { IQueryCategoryRepository } from 'src/category/application/query-repository/query-category-repository';
import { OrmCategoryQueryRepository } from '../repositories/orm-category-query-repository';
import { FindAllCategoriesInfraestructureRequestDTO } from '../dto-request/find-all-categories-infraestructure-request-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteCategoryApplication } from 'src/category/application/services/delete-category-application';
import { ICredential } from 'src/auth/application/model/credential.interface';
import { GetCredential } from 'src/auth/infraestructure/jwt/decorator/get-credential.decorator';
import { credential } from 'firebase-admin';
import { FindCategoryByProductIdApplicationRequestDTO } from 'src/category/application/dto/request/find-category-by-productid-application-request.dto';
import { FindCategoryByProductIdInfraestructureRequestDTO } from '../dto-request/find-category-by-productid-infrastructure-request.dto';
import { FindCategoryByIdApplicationService } from 'src/category/application/services/find-category-by-id-application';
import { FindCategoryByProductIdApplicationService } from 'src/category/application/services/find-category-by-product-id-application';
import { PerformanceDecorator } from 'src/common/application/aspects/performance-decorator/performance-decorator';
import { NestTimer } from 'src/common/infraestructure/timer/nets-timer';
import { FindCategoryByIdInfraestructureRequestDTO } from '../dto-request/find-category-by-id-infraestructure-request.dto';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/guards/jwt-auth.guard';
import { FindCategoryByBundleIdApplicationService } from 'src/category/application/services/find-category-by-bundle-id-application';
import { FindCategoryByBundleIdInfraestructureRequestDTO } from '../dto-request/find-category-by-bundle-id-infrastructure-request.dto';

@Controller('category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags("Category")
export class CategoryController {

  private readonly ormCategoryRepo: ICategoryRepository;
  private readonly idGen: IIdGen<string>;
  private readonly ormCategoryQueryRepo: IQueryCategoryRepository;
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen = new UuidGen();
    this.ormCategoryRepo = new OrmCategoryRepository(PgDatabaseSingleton.getInstance());
    this.ormCategoryQueryRepo = new OrmCategoryQueryRepository(PgDatabaseSingleton.getInstance());
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
    if(!entry.products) entry.products=[]
    let service = new ExceptionDecorator(
      new CreateCategoryApplication(
        new RabbitMQPublisher(this.channel),
        this.ormCategoryRepo,
        this.idGen,
        new CloudinaryService()
      )
    );

    const buffer = image.buffer;
    const response = await service.execute({ userId: credential.account.idUser, ...entry, image: buffer });
    return response.getValue
  }

  @Get('all')
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

  @Get('CategoryByProductId')
  async getCategoryByProductId(
    @GetCredential() credential:ICredential,
    @Query() entry: FindCategoryByProductIdInfraestructureRequestDTO
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

  @Get('CategoryByBundleId')
  async getCategoryByBundleId(
    @GetCredential() credential: ICredential,
    @Query() entry: FindCategoryByBundleIdInfraestructureRequestDTO
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

  @Get('')
  async getProductById(
    @GetCredential() credential:ICredential,
    @Query() entry:FindCategoryByIdInfraestructureRequestDTO
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

  @Delete('delete/:id')
  async deleteCategory(
    @GetCredential() credential:ICredential,
    @Param('id') id: string) {
    
    let service = new ExceptionDecorator(
      new DeleteCategoryApplication(this.ormCategoryRepo)
    )

    const response = await service.execute({ userId:credential.account.idUser, id });
    return response.getValue
  }
}
