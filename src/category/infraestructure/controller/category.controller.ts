import { Body, Controller, FileTypeValidator, Get, Inject, Logger, ParseFilePipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
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
import { RabbitMQEventPublisher } from 'src/common/infraestructure/events/publishers/rabbittMq.publisher';
import { Channel } from 'amqplib';
import { IQueryCategoryRepository } from 'src/category/application/query-repository/query-category-repository';
import { OrmCategoryQueryRepository } from '../repositories/orm-category-query-repository';
import { FindAllCategoriesInfraestructureRequestDTO } from '../dto-request/find-all-categories-infraestructure-request-dto';

@Controller('category')
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
    let service = new ExceptionDecorator(
      new CreateCategoryApplication(
        new RabbitMQEventPublisher(this.channel),
        this.ormCategoryRepo,
        this.idGen,
        new CloudinaryService()
      )
    );

    const buffer = image.buffer;
    const response = await service.execute({ userId: 'none', ...entry, image: buffer });
    return response.getValue
  }

  @Get('all')
  async getAllCategories(@Query() entry: FindAllCategoriesInfraestructureRequestDTO) {
    if (!entry.page) entry.page = 1;
    if (!entry.perPage) entry.perPage = 10;

    const pagination: PaginationRequestDTO = { userId: 'none', page: entry.page, perPage: entry.perPage };

    let service = new ExceptionDecorator(
      new LoggerDecorator(
        new FindAllCategoriesApplicationService(this.ormCategoryQueryRepo),
        new NestLogger(new Logger())
      )
    );

    const response = await service.execute({ ...pagination });
    return response.getValue
  }
}
