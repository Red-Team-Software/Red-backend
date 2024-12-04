import { Body, Controller, FileTypeValidator, Get, Inject, Logger, ParseFilePipe, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { CreateProductApplicationService } from 'src/product/application/services/command/create-product-application.service';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { CloudinaryService } from 'src/common/infraestructure/file-uploader/cloudinary-uploader';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IQueryProductRepository } from 'src/product/application/query-repository/query-product-repository';
import { FindAllProductsApplicationService } from 'src/product/application/services/query/find-all-products-application.service';
import { PaginationRequestDTO } from 'src/common/application/services/dto/request/pagination-request-dto';
import { Channel } from 'amqplib';
import { FindAllProductsAndComboApplicationService } from 'src/product/application/services/query/find-all-product-and-combo-by-name-application.service';
import { IQueryBundleRepository } from 'src/bundle/application/query-repository/query-bundle-repository';
import { OrmBundleQueryRepository } from 'src/bundle/infraestructure/repositories/orm-repository/orm-bundle-query-repository';
import { FindAllProductsbyNameApplicationRequestDTO } from 'src/product/application/dto/request/find-all-products-and-combos-request-dto';
import { FindProductByIdApplicationService } from 'src/product/application/services/query/find-product-by-id-application.service';
import { RabbitMQPublisher } from 'src/common/infraestructure/events/publishers/rabbit-mq-publisher';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/guards/jwt-auth.guard';
import { ICredential } from 'src/auth/application/model/credential.interface';
import { GetCredential } from 'src/auth/infraestructure/jwt/decorator/get-credential.decorator';
import { PerformanceDecorator } from 'src/common/application/aspects/performance-decorator/performance-decorator';
import { AuditDecorator } from 'src/common/application/aspects/audit-decorator/audit-decorator';
import { IAuditRepository } from 'src/common/application/repositories/audit.repository';
import { OrmAuditRepository } from 'src/common/infraestructure/repository/orm-repository/orm-audit.repository';
import { DateHandler } from 'src/common/infraestructure/date-handler/date-handler';
import { NestTimer } from 'src/common/infraestructure/timer/nets-timer';
import { CreatePromotionApplicationService } from 'src/promotion/application/services/command/create-promotion-application.service';
import { CreatePromotionInfraestructureRequestDTO } from '../dto/request/create-promotion-infraestructure-request-dto';
import { CreatePromotionInfraestructureResponseDTO } from '../dto/response/create-promotion-infraestructure-response-dto';
import { FindPromotionByIdInfraestructureRequestDTO } from '../dto/request/find-product-by-id-infraestructure-request-dto';
import { FindAllPromotionInfraestructureRequestDTO } from '../dto/request/find-all-promotion-infraestructure-request-dto';
import { FindAllPromotionInfraestructureResponseDTO } from '../dto/response/find-all-promotion-infraestructure-response-dto';
import { FindPromotionByIdInfraestructureResponseDTO } from '../dto/response/find-promotion-by-id-infraestructure-response-dto';
import { IQueryPromotionRepository } from 'src/promotion/application/query-repository/promotion.query.repository.interface';
import { ICommandPromotionRepository } from 'src/promotion/domain/repository/promotion.command.repository.interface';
import { OrmPromotionQueryRepository } from '../repositories/orm-repository/orm-promotion-query-repository';
import { OrmPromotionCommandRepository } from '../repositories/orm-repository/orm-promotion-command-repository';
import { OrmUserQueryRepository } from 'src/user/infraestructure/repositories/orm-repository/orm-user-query-repository';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Promotion')
@Controller('promotion')
export class PromotionController {

  private readonly idGen: IIdGen<string> 
  private readonly auditRepository: IAuditRepository
  private readonly ormPromotionQueryRepo:IQueryPromotionRepository
  private readonly ormPromotionCommandRepo:ICommandPromotionRepository
  private readonly ormQueryBundleRepo:IQueryBundleRepository
  private readonly ormQueryProductRepo:IQueryProductRepository

  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.idGen= new UuidGen()
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
    this.ormPromotionQueryRepo=new OrmPromotionQueryRepository(PgDatabaseSingleton.getInstance())
    this.ormPromotionCommandRepo=new OrmPromotionCommandRepository(PgDatabaseSingleton.getInstance())
    this.ormQueryBundleRepo=new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance())
  }

  @ApiResponse({
    status: 200,
    description: 'Create promotion',
    type: CreatePromotionInfraestructureResponseDTO,
  })
  @Post('create')
  async createPromotion(
    @GetCredential() credential:ICredential,
    @Body() entry: CreatePromotionInfraestructureRequestDTO
  ){

    let service= new ExceptionDecorator(
      new AuditDecorator(
        new PerformanceDecorator(
          new CreatePromotionApplicationService(
            this.ormPromotionCommandRepo,
            this.ormPromotionQueryRepo,
            this.ormQueryProductRepo,
            this.ormQueryBundleRepo,
            this.idGen,
            new RabbitMQPublisher(this.channel),
          ),new NestTimer(),new NestLogger(new Logger())
        ),this.auditRepository,new DateHandler()
      )
    )
    let response=await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }

  @ApiResponse({
    status: 200,
    description: 'find all promotions',
    type: FindAllPromotionInfraestructureResponseDTO,
  })
  @Get('all')
  async getAllProducts(
    @GetCredential() credential:ICredential,
    @Query() entry:FindAllPromotionInfraestructureRequestDTO
  ){
    if(!entry.page)
      entry.page=1
    if(!entry.perPage)
      entry.perPage=10

    const pagination:PaginationRequestDTO={userId:credential.account.idUser,page:entry.page, perPage:entry.perPage}

    // let service= new ExceptionDecorator(
    //     new LoggerDecorator(
    //       new PerformanceDecorator(
    //         new FindAllProductsApplicationService(
    //           this.ormProductQueryRepo
    //         ),new NestTimer(),new NestLogger(new Logger())
    //       ),new NestLogger(new Logger())
    //     )
    //   )
    // let response= await service.execute({...pagination})
    // return response.getValue
  }

  @ApiResponse({
    status: 200,
    description: 'find all promotions',
    type: FindPromotionByIdInfraestructureResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getProductById(
    @GetCredential() credential:ICredential,
    @Query() entry:FindPromotionByIdInfraestructureRequestDTO
  ){

    // let service= new ExceptionDecorator(
    //   new LoggerDecorator(
    //     new PerformanceDecorator(
    //       new FindProductByIdApplicationService(
    //         this.ormProductRepo
    //       ),new NestTimer(),new NestLogger(new Logger())
    //     ),new NestLogger(new Logger())
    //   )
    // )
    
    // let response= await service.execute({userId:credential.account.idUser,...entry})
    // return response.getValue
  }
}
