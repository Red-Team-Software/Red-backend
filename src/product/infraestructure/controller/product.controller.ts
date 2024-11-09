import { Body, Controller, FileTypeValidator, Get, Inject, Logger, ParseFilePipe, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { IProductRepository } from 'src/product/domain/repository/product.interface.repositry';
import { OrmProductRepository } from '../repositories/orm-repository/orm-product-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateProductInfraestructureRequestDTO } from '../dto-request/create-product-infraestructure-request-dto';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { CreateProductApplicationService } from 'src/product/application/services/command/create-product-application.service';
import { EventBus } from 'src/common/infraestructure/events/publishers/event-bus';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { CloudinaryService } from 'src/common/infraestructure/file-uploader/cloudinary-uploader';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { OrmProductQueryRepository } from '../repositories/orm-repository/orm-product-query-repository';
import { FindAllProductsApplicationService } from 'src/product/application/services/query/find-all-products-application.service';
import { FindAllProductsInfraestructureRequestDTO } from '../dto-request/find-all-products-infraestructure-request-dto';
import { PaginationRequestDTO } from 'src/common/application/services/dto/request/pagination-request-dto';
import { RabbitMQEventPublisher } from 'src/common/infraestructure/events/publishers/rabbittMq.publisher';
import { Channel } from 'amqplib';
import { FindAllProductsAndBundlesInfraestructureRequestDTO } from '../dto-request/find-all-products-and-bundles-infraestructure-request-dto';
import { FindAllProductsAndComboApplicationService } from 'src/product/application/services/query/find-all-product-and-combo-by-name-application.service';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { OrmBundleQueryRepository } from 'src/bundle/infraestructure/repositories/orm-repository/orm-bundle-query-repository';
import { FindAllProductsbyNameApplicationRequestDTO } from 'src/product/application/dto/request/find-all-products-and-combos-request-dto';


@Controller('product')
export class ProductController {

  //todo modulo seatrch para este 
  private readonly ormProductRepo:IProductRepository
  private readonly idGen: IIdGen<string> 
  private readonly ormProductQueryRepo:IQueryProductRepository
  private readonly ormBundleQueryRepo:IQueryBundleRepository
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen= new UuidGen()
    this.ormProductRepo= new OrmProductRepository(PgDatabaseSingleton.getInstance())
    this.ormProductQueryRepo= new OrmProductQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormBundleQueryRepo= new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance())
  }

  @Post('create')
  @UseInterceptors(FilesInterceptor('images'))  
  async createProduct(@Body() entry: CreateProductInfraestructureRequestDTO,
  @UploadedFiles(
    new ParseFilePipe({
      validators: [new FileTypeValidator({
        fileType:/(jpeg|.jpg|.png)$/
      }),
      ]
    }),
  ) images: Express.Multer.File[]) {

    let service= new ExceptionDecorator(
          new CreateProductApplicationService(
            new RabbitMQEventPublisher(this.channel),
            this.ormProductRepo,
            this.idGen,
            new CloudinaryService()
          ),
      )
      let buffers=images.map(image=>image.buffer)
    let response= await service.execute({userId:'none',...entry,images:buffers})
    return response.getValue
  }

  @Get('all')
  async getAllProducts(@Query() entry:FindAllProductsInfraestructureRequestDTO){

    if(!entry.page)
      entry.page=1
    if(!entry.perPage)
      entry.perPage=10

    const pagination:PaginationRequestDTO={userId:'none',page:entry.page, perPage:entry.perPage}

    let service= new ExceptionDecorator(
        new LoggerDecorator(
          new FindAllProductsApplicationService(
            this.ormProductQueryRepo
          ),
          new NestLogger(new Logger())
        )
      )
    let response= await service.execute({...pagination})
    return response.getValue
  }

  @Get('all-product-bundle')
  async getAllProductsAndBundles(@Query() entry:FindAllProductsAndBundlesInfraestructureRequestDTO){

    if(!entry.page)
      entry.page=1
    if(!entry.perPage)
      entry.perPage=10

    const pagination:FindAllProductsbyNameApplicationRequestDTO={userId:'none',page:entry.page, perPage:entry.perPage,name:entry.term}

    let service= new ExceptionDecorator(
        new LoggerDecorator(
          new FindAllProductsAndComboApplicationService(
            this.ormProductQueryRepo,
            this.ormBundleQueryRepo
          ),
          new NestLogger(new Logger())
        )
      )
    let response= await service.execute({...pagination})
    return response.getValue
  }
}
