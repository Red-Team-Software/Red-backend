import { Body, Controller, Get, Param, Post, Query, Logger, Inject, UseGuards } from '@nestjs/common';
import { OrmCuponCommandRepository } from '../repository/orm-cupon-command-repository';
import { PgDatabaseSingleton } from 'src/common/infraestructure/database/pg-database.singleton';
import { CreateCuponApplicationService } from 'src/cupon/application/services/command/create-cupon-application-service';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { IQueryCuponRepository } from 'src/cupon/application/query-repository/query-cupon-repository';
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
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Cupon } from 'src/cupon/domain/aggregate/cupon.aggregate';
import { OrmCuponEntity } from '../orm-entities/orm-cupon-entity';
import { FindCuponByCodeApplicationService } from 'src/cupon/application/services/query/find-cupon-by-code-application-service';
import { ICommandCuponRepository } from 'src/cupon/domain/repository/command-cupon-repository';
import { OrmCuponUserEntity } from '../orm-entities/orm-cupon-user-entity';
import { CuponUser } from 'src/cupon/domain/entities/cuponUser/cuponUser.entity';
import { NotificationQueues } from 'src/notification/infraestructure/queues/notification.queues';
import { RabbitMQSubscriber } from 'src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber';
import { ICreateOrder } from 'src/product/infraestructure/interfaces/create-order.interface';
import { MarkCuponAsUsedApplicationService } from 'src/cupon/application/services/command/mark-cupon-used-application-service';
import { RegisterCuponToUserInfraestructureRequestDTO } from '../dto-request/register-cupon-to-user-infraestructure-dto';
import { ByIdDTO } from 'src/common/infraestructure/dto/entry/by-id.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cupon')
@Controller('cupon')

export class CuponController {

  private readonly subscriber:RabbitMQSubscriber;
  private readonly ormCuponCommandRepo: ICommandCuponRepository;
  private readonly idGen: IIdGen<string>;
  private readonly ormCuponQueryRepo: IQueryCuponRepository;
  private readonly cuponMapper: IMapper<Cupon, OrmCuponEntity>;
  private readonly cuponUserMapper: IMapper<CuponUser, OrmCuponUserEntity>;

  constructor(@Inject("RABBITMQ_CONNECTION") private readonly channel: Channel) {
    this.idGen = new UuidGen();
    this.subscriber=new RabbitMQSubscriber(this.channel);
    this.ormCuponCommandRepo = new OrmCuponCommandRepository(PgDatabaseSingleton.getInstance(),this.cuponMapper, this.cuponUserMapper);
    this.ormCuponQueryRepo = new OrmCuponQueryRepository(PgDatabaseSingleton.getInstance(),this.cuponMapper);

    this.subscriber.buildQueue({
      name:'OrderEvents',
      pattern: 'OrderRegistered',
      exchange:{
          name:'DomainEvent',
          type:'direct',
          options:{
              durable:false,
          }
      }
  });

  this.initializeQueues();

  this.subscriber.consume<ICreateOrder>(
              { name: 'OrderEvents/OrderRegistered'}, 
              (data):Promise<void>=>{
                if(data.orderCuponId){
                  this.MarkCuponAsRegistered(data)
                }
                  return
              }
          )
  }

      private initializeQueues():void{        
          NotificationQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
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
      
      
  async MarkCuponAsRegistered(data:ICreateOrder){
    let service= new ExceptionDecorator(
      new LoggerDecorator(
        new MarkCuponAsUsedApplicationService(this.ormCuponQueryRepo,this.ormCuponCommandRepo),
        new NestLogger(new Logger())
      )
    );

    let response= await service.execute({userId:data.orderUserId,cuponId:data.orderCuponId});

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

  @Get(':code')
  async getCuponByCode(
    @GetCredential() credential:ICredential,
    @Param('code') code:string 
  ){
    let service = new ExceptionDecorator(
      new LoggerDecorator(
        new FindCuponByCodeApplicationService(this.ormCuponQueryRepo), new NestLogger(new Logger())
      )
    );

    let response= service.execute({userId:credential.account.idUser, cuponCode:code})

    return (await response).getValue
  }

  @Post('registerCupon')
  async registerCupon(
    @GetCredential() credential:ICredential,
    @Body() entry: RegisterCuponToUserInfraestructureRequestDTO){
      
    }
}

