import { Body, Controller, FileTypeValidator, Get, Inject, Logger, ParseFilePipe, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { FilesInterceptor } from "@nestjs/platform-express/multer"
import { IBundleRepository } from "src/bundle/domain/repository/product.repositry.interface"
import { IIdGen } from "src/common/application/id-gen/id-gen.interface"
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen"
import { CreateBundleInfraestructureRequestDTO } from "../dto-request/create-bundle-infraestructure-request-dto"
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator"
import { Channel } from "amqplib"
import { CreateBundleApplicationService } from "src/bundle/application/services/command/create-bundle-application.service"
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader"
import { OrmBundleRepository } from "../repositories/orm-repository/orm-bundle-repository"
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton"
import { PaginationRequestDTO } from "src/common/application/services/dto/request/pagination-request-dto"
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator"
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository"
import { OrmBundleQueryRepository } from "../repositories/orm-repository/orm-bundle-query-repository"
import { NestLogger } from "src/common/infraestructure/logger/nest-logger"
import { FindAllBundlesInfraestructureRequestDTO } from "../dto-request/find-all-bundle-infraestructure-request-dto"
import { FindAllBundlesApplicationService } from "src/bundle/application/services/query/find-all-bundles-application.service"
import { FindAllBundlesbyNameApplicationRequestDTO } from "src/bundle/application/dto/request/find-all-bundles-by-name-application-request-dto"
import { FindAllBundlesByNameInfraestructureRequestDTO } from "../dto-request/find-all-bundle-by-name-infraestructure-request-dto"
import { FindAllBundlesByNameApplicationService } from "src/bundle/application/services/query/find-all-bundles-by-name-application.service"
import { FindBundleByIdInfraestructureRequestDTO } from "../dto-request/find-bundle-by-id-infraestructure-request-dto"
import { FindBundleByIdApplicationService } from "src/bundle/application/services/query/find-bundle-by-id-application.service"
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard"
import { ICredential } from "src/auth/application/model/credential.interface"
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator"
import { IAuditRepository } from "src/common/application/repositories/audit.repository"
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository"
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator"
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator"
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler"
import { NestTimer } from "src/common/infraestructure/timer/nets-timer"

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Bundle')
@Controller('bundle')
export class BundleController {

  private readonly ormBundletRepo:IBundleRepository
  private readonly ormQueryBundletRepo:IQueryBundleRepository
  private readonly idGen: IIdGen<string> 
  private readonly auditRepository: IAuditRepository
  
  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
  ) {
    this.ormBundletRepo=new OrmBundleRepository(PgDatabaseSingleton.getInstance())
    this.idGen= new UuidGen()
    this.ormQueryBundletRepo=new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance())
    this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
  }

  @Post('create')
  @UseInterceptors(FilesInterceptor('images'))  
  async createBundle(
    @GetCredential() credential:ICredential,
    @Body() entry: CreateBundleInfraestructureRequestDTO,
    @UploadedFiles(
    new ParseFilePipe({
      validators: [new FileTypeValidator({
        fileType:/(jpeg|.jpg|.png)$/
      }),
      ]
    }),
  ) images: Express.Multer.File[]) {

    let service= new ExceptionDecorator(
      new AuditDecorator(
          new PerformanceDecorator(
            new CreateBundleApplicationService(
              new RabbitMQPublisher(this.channel),
              this.ormBundletRepo,
              this.idGen,
              new CloudinaryService()
            ),new NestTimer(),new NestLogger(new Logger())
          ),this.auditRepository,new DateHandler()
        )
      )
      let buffers=images.map(image=>image.buffer)
    let response= await service.execute({userId:credential.account.idUser,...entry,images:buffers})
    return response.getValue
  }

  @Get('all-name')
  async getAllBundlesByName(
    @GetCredential() credential:ICredential,
    @Query() entry:FindAllBundlesByNameInfraestructureRequestDTO
  ){
    if(!entry.page)
      entry.page=1
    if(!entry.perPage)
      entry.perPage=10

    const pagination:FindAllBundlesbyNameApplicationRequestDTO={
      userId:credential.account.idUser,
      page:entry.page,
      perPage:entry.perPage,
      name:entry.term
    }

    let service= new ExceptionDecorator(
      new LoggerDecorator(
          new PerformanceDecorator(
            new FindAllBundlesByNameApplicationService(
              this.ormQueryBundletRepo
            ),new NestTimer(), new NestLogger(new Logger())
          ),new NestLogger(new Logger())
      )
    )
  let response= await service.execute({...pagination})
  return response.getValue
  }

  @Get('all')
  async getAllBundles(
    @GetCredential() credential:ICredential,
    @Query() entry:FindAllBundlesInfraestructureRequestDTO
  ){
    if(!entry.page)
      entry.page=1
    if(!entry.perPage)
      entry.perPage=10

    const pagination:PaginationRequestDTO={userId:credential.account.idUser,page:entry.page, perPage:entry.perPage}

    let service= new ExceptionDecorator(
      new LoggerDecorator(
          new PerformanceDecorator(
            new FindAllBundlesApplicationService(
              this.ormQueryBundletRepo
            ),new NestTimer(), new NestLogger(new Logger())
          ),new NestLogger(new Logger())
      )
    )

    let response= await service.execute({...pagination})
    return response.getValue
  }

  @Get('')
  async getBundleById(
    @GetCredential() credential:ICredential,
    @Query() entry:FindBundleByIdInfraestructureRequestDTO
  ){

    let service= new ExceptionDecorator(
      new LoggerDecorator(
          new PerformanceDecorator(
            new FindBundleByIdApplicationService(
              this.ormBundletRepo
            ),new NestTimer(), new NestLogger(new Logger())
          ),new NestLogger(new Logger())
      )
    )
    let response= await service.execute({userId:credential.account.idUser,...entry})
    return response.getValue
  }
}
