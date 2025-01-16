import { Body, Controller, Get, Param, Post, Query, Logger, Inject, UseGuards } from '@nestjs/common';
import { ICuponRepository } from 'src/cupon/domain/repository/cupon.interface.repository';
import { OrmCuponRepository } from '../repository/orm-repository/orm-cupon-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateCuponApplicationService } from 'src/cupon/application/services/command/create-cupon-application-service';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { IQueryCuponRepository } from 'src/cupon/application/query-repository/query-cupon-repository';
import { OrmCuponQueryRepository } from '../repository/orm-repository/orm-cupon-query-repository';
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
import { ByIdDTO } from 'src/common/infraestructure/dto/entry/by-id.dto';
import { Mongoose } from 'mongoose';
import { RabbitMQSubscriber } from 'src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber';
import { CouponQueues } from '../queues/coupon.queues';
import { ICuponRegistered } from '../interfaces/cupon-created.interface';
import { CouponRegisteredSyncroniceService } from '../service/syncronice/coupon-registered-syncronice.service';
import { ICuponDeleted } from '../interfaces/cupon-delete.interface';
import { CouponDeletedSyncroniceService } from '../service/syncronice/coupon-deleted-syncronice.service';
import { ICuponChangeState } from '../interfaces/cupon-state-change.interface';
import { CouponStateUpdatedSyncroniceService } from '../service/syncronice/coupon-state-updated-syncronice.service';
import { OdmCuponQueryRepository } from '../repository/odm-repository/odm-query-coupon-repository';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cupon')
@Controller('cupon')
export class CuponController {

  private readonly ormCuponRepo: ICuponRepository;
  private readonly idGen: IIdGen<string>;
  private readonly ormCuponQueryRepo: IQueryCuponRepository;
  private readonly subscriber: RabbitMQSubscriber;

  private initializeQueues():void{        
      CouponQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
  }
                  
  private buildQueue(name: string, pattern: string) {
      this.subscriber.buildQueue({
          name,
          pattern,
          exchange: {
              name: 'DomainEvent',
              type: 'direct',
              options: {
                  durable: false,
              },
          },
      })
  }


  constructor(
    @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel,
    @Inject("MONGO_CONNECTION") private readonly mongoose: Mongoose
  ) {
    this.idGen = new UuidGen();
    this.ormCuponRepo = new OrmCuponRepository(PgDatabaseSingleton.getInstance());
    this.ormCuponQueryRepo = new OdmCuponQueryRepository(mongoose);
    this.subscriber= new RabbitMQSubscriber(this.channel);

    this.initializeQueues();
          
    this.subscriber.consume<ICuponRegistered>(
      { name: 'CouponSync/CuponRegistered'}, 
      (data):Promise<void>=>{
          this.syncCouponRegistered(data)
          return
      }
    )

    this.subscriber.consume<ICuponDeleted>(
      { name: 'CouponSync/CuponDeleted'}, 
      (data):Promise<void>=>{
          this.syncCouponDeleted(data)
          return
      }
    )

    this.subscriber.consume<ICuponChangeState>(
      { name: 'CouponSync/CuponStateChanged'}, 
      (data):Promise<void>=>{
          this.syncCouponUpdated(data)
          return
      }
    )
  
  }

  async syncCouponRegistered(data:ICuponRegistered){
      let service= new CouponRegisteredSyncroniceService(this.mongoose)
      await service.execute({...data})
  }

  async syncCouponDeleted(data:ICuponDeleted){
    let service= new CouponDeletedSyncroniceService(this.mongoose)
    await service.execute({...data})
  }

  async syncCouponUpdated(data:ICuponChangeState){
    let service= new CouponStateUpdatedSyncroniceService(this.mongoose)
    await service.execute({...data})
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
        this.ormCuponQueryRepo,
        this.idGen
      )
    );
    let response = await service.execute({userId:credential.account.idUser,...entry});
    return response.getValue;
  }

  @Get('many')
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
    @Param() entry: ByIdDTO
  ) {
      let service = new ExceptionDecorator(
          new LoggerDecorator(
              new FindCuponByIdApplicationService( 
                  this.ormCuponQueryRepo
              ),
              new NestLogger(new Logger()) 
          )
      );
      
      let response = await service.execute({ userId: credential.account.idUser, id: entry.id }); 
      return response.getValue; 
  }
  
}
