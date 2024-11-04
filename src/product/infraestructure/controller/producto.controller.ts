import { Body, Controller, Get, Post } from '@nestjs/common';
import { IProductRepository } from 'src/product/domain/repository/product.interface.repositry';
import { OrmProductRepository } from '../repositories/orm-repository/orm-product-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateProductInfraestructureRequestDTO } from '../dto-request/create-product-infraestructure-request-dto';

@Controller('product')
export class ProductoController {

  private readonly ormProductRepo:IProductRepository

  constructor() {
    this.ormProductRepo= new OrmProductRepository(PgDatabaseSingleton.getInstance())
  }

  @Post('create')
  async createProduct(@Body() entry: CreateProductInfraestructureRequestDTO) {
    return 'producto'
  }
}
