import { Body, Controller, Get, Param, Post, Query, Logger, Inject, UseGuards } from '@nestjs/common';
import { ICuponRepository } from 'src/cupon/domain/repository/cupon.interface.repository';
import { OrmCuponRepository } from '../repository/orm-cupon-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateCuponApplicationService } from 'src/cupon/application/services/command/create-cupon-application-service';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { IQueryCuponRepository } from 'src/cupon/domain/query-repository/query-cupon-repository';
import { OrmCuponQueryRepository } from '../repository/orm-cupon-query-repository';
import { FindCuponByIdApplicationService } from 'src/cupon/application/services/query/find-cupon-by-id-application-service';
import { FindAllCuponsInfraestructureRequestDTO } from '../dto-request/find-all-cupons-infraestructure-request';
import { PaginationRequestDTO } from 'src/common/application/services/dto/request/pagination-request-dto';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { FindAllCuponsApplicationService } from 'src/cupon/application/services/query/find-all-cupons-application-service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCuponInfraestructureRequestDTO } from '../dto-request/create-cupon-infraestructure-request';
import { RabbitMQPublisher } from 'src/common/infraestructure/events/publishers/rabbit-mq-publisher';
import { Channel } from 'amqplib';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/guards/jwt-auth.guard';
import { ICredential } from 'src/auth/application/model/credential.interface';
import { GetCredential } from 'src/auth/infraestructure/jwt/decorator/get-credential.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cupon')
@Controller('cupon')
export class CuponController {

  private readonly ormCuponRepo: ICuponRepository;
  private readonly idGen: IIdGen<string>;
  private readonly ormCuponQueryRepo: IQueryCuponRepository;

  constructor(@Inject("RABBITMQ_CONNECTION") private readonly channel: Channel) {
    this.idGen = new UuidGen();
    this.ormCuponRepo = new OrmCuponRepository(PgDatabaseSingleton.getInstance());
    this.ormCuponQueryRepo = new OrmCuponQueryRepository(PgDatabaseSingleton.getInstance());
  }

  @Post('create')
  async createCupon(
    @GetCredential() credential:ICredential,
    @Body() entry: CreateCuponInfraestructureRequestDTO
  ) {
    let service = new ExceptionDecorator(
      new CreateCuponApplicationService(
        new RabbitMQPublisher(this.channel),
        this.ormCuponRepo,
        this.idGen
      )
    );
    let response = await service.execute({userId:credential.account.idUser,...entry});
    return response.getValue;
  }

  @Get('all')
  async getAllCupons(
    @GetCredential() credential:ICredential,
    @Query() entry: FindAllCuponsInfraestructureRequestDTO) {

    if (!entry.page) entry.page = 1;
    if (!entry.perPage) entry.perPage = 10;

    const pagination: PaginationRequestDTO = { 
      userId: credential.account.idUser, 
      page: entry.page, 
      perPage: entry.perPage 
    };

    let service = new ExceptionDecorator(
      new LoggerDecorator(
        new FindAllCuponsApplicationService(this.ormCuponQueryRepo),
        new NestLogger(new Logger())
      )
    );

    let response = await service.execute({ ...pagination });
    return response.getValue;
  }

  @Get(':id')
  async getCuponById(
    @GetCredential() credential:ICredential,
    @Param('id') id: string
  ) {
      let service = new ExceptionDecorator(
          new LoggerDecorator(
              new FindCuponByIdApplicationService( 
                  this.ormCuponRepo
              ),
              new NestLogger(new Logger()) 
          )
      );
      
      let response = await service.execute({ userId: credential.account.idUser, id: id }); 
      return response.getValue; 
  }
  
}
