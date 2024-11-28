import { Body, Controller, Get, Param, Post, Query, Delete, Logger } from '@nestjs/common';
import { ICuponRepository } from 'src/cupon/domain/repository/cupon.interface.repository';
import { OrmCuponRepository } from '../repository/orm-cupon-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateCuponApplicationRequestDTO } from 'src/cupon/application/dto/request/create-cupon-application-requestdto';
import { CreateCuponApplicationService } from 'src/cupon/application/services/command/create-cupon-application-service';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { IQueryCuponRepository } from 'src/cupon/domain/query-repository/query-cupon-repository';
import { OrmCuponQueryRepository } from '../repository/orm-cupon-query-repository';
import { FindCuponByIdApplicationService } from 'src/cupon/application/services/query/find-cupon-by-id-application-service';
import { NotFoundCuponApplicationException } from 'src/cupon/application/application-exception/not-found-cupon-application-exception';
import { FindAllCuponsInfraestructureRequestDTO } from '../dto-request/find-all-cupons-infraestructure-request';
import { PaginationRequestDTO } from 'src/common/application/services/dto/request/pagination-request-dto';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { FindAllCuponsApplicationService } from 'src/cupon/application/services/query/find-all-cupons-application-service';

@Controller('cupon')
export class CuponController {

  private readonly ormCuponRepo: ICuponRepository;
  private readonly idGen: IIdGen<string>;
  private readonly ormCuponQueryRepo: IQueryCuponRepository;

  constructor() {
    this.idGen = new UuidGen();
    this.ormCuponRepo = new OrmCuponRepository(PgDatabaseSingleton.getInstance());
    this.ormCuponQueryRepo = new OrmCuponQueryRepository(PgDatabaseSingleton.getInstance());
  }

  @Post('create')
  async createCupon(@Body() entry: CreateCuponApplicationRequestDTO) {
    let service = new ExceptionDecorator(
      new CreateCuponApplicationService(
        this.ormCuponRepo,
        this.idGen
      )
    );
    let response = await service.execute(entry);
    return response.getValue;
  }

  @Get('all')
  async getAllCupons(@Query() entry: FindAllCuponsInfraestructureRequestDTO) {
    // Definir valores por defecto para la paginación
    if (!entry.page) entry.page = 1;
    if (!entry.perPage) entry.perPage = 10;

    // Crear objeto de paginación
    const pagination: PaginationRequestDTO = { userId: 'none', page: entry.page, perPage: entry.perPage };

    // Crear servicio con excepciones y decoradores
    let service = new ExceptionDecorator(
      new LoggerDecorator(
        new FindAllCuponsApplicationService(this.ormCuponQueryRepo),
        new NestLogger(new Logger())
      )
    );

    // Ejecutar el servicio
    let response = await service.execute({ ...pagination });
    return response.getValue;
  }

  @Get(':id')
  async getCuponById(@Param('id') id: string) {
      let service = new ExceptionDecorator(
          new LoggerDecorator(
              new FindCuponByIdApplicationService( // Usamos el servicio de FindCuponByIdApplicationService
                  this.ormCuponRepo
              ),
              new NestLogger(new Logger()) // Decorador de log para el servicio
          )
      );
      
      let response = await service.execute({ userId: 'none', id: id }); // Llamamos al servicio pasando el ID del cupón
      return response.getValue; // Retornamos la respuesta del servicio
  }
  


}
