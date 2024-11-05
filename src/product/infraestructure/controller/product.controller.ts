import { Body, Controller, FileTypeValidator, Get, Logger, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { IProductRepository } from 'src/product/domain/repository/product.interface.repositry';
import { OrmProductRepository } from '../repositories/orm-repository/orm-product-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateProductInfraestructureRequestDTO } from '../dto-request/create-product-infraestructure-request-dto';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { CreateProductApplicationService } from 'src/product/application/services/create-product-application.service';
import { EventBus } from 'src/common/infraestructure/events/publishers/event-bus';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { CloudinaryService } from 'src/common/infraestructure/file-uploader/cloudinary-uploader';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@Controller('product')
export class ProductController {

  private readonly ormProductRepo:IProductRepository
  private readonly idGen: IIdGen<string> 

  constructor() {
    this.idGen= new UuidGen()
    this.ormProductRepo= new OrmProductRepository(PgDatabaseSingleton.getInstance())
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
            new EventBus(),
            this.ormProductRepo,
            this.idGen,
            new CloudinaryService()
          ),
      )
      let buffers=images.map(image=>image.buffer)
    let response= await service.execute({userId:'none',...entry,images:buffers})
    return response.getValue
  }
}
