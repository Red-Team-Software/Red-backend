import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
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


@Controller('product')
export class ProductController {

  private readonly ormProductRepo:IProductRepository
  private readonly idGen: IIdGen<string> 

  constructor() {
    this.idGen= new UuidGen()
    this.ormProductRepo= new OrmProductRepository(PgDatabaseSingleton.getInstance())
  }

  @Post('create')
  async createProduct(@Body() entry: CreateProductInfraestructureRequestDTO) {


    let service= new ExceptionDecorator(
        new LoggerDecorator(
          new CreateProductApplicationService(
            new EventBus(),
            this.ormProductRepo,
            this.idGen
          ),
          new NestLogger(new Logger())
        )
      )
    let response= await service.execute({userId:'none',...entry})
    return response.getValue
  }
}
