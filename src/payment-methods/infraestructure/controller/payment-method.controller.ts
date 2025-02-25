import { Body, Controller, FileTypeValidator, Get, Inject, Logger, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { PaymentMethodAgregate } from "src/payment-methods/domain/agregate/payment-method-agregate";
import { PaymentMethodEntity } from "../entity/orm-entity/orm-payment-method-entity";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { Channel } from "amqplib";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher";
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton";
import { IPaymentMethodRepository } from "src/payment-methods/domain/repository/payment-method-repository.interface";
import { OrmPaymentMethodMapper } from "../mapper/orm-mapper/orm-payment-method-mapper";
import { OrmPaymentMethodQueryRepository } from "../repository/orm-repository/orm-payment-method-query-repository";
import { OrmPaymentMethodRepository } from "../repository/orm-repository/orm-payment-method-repository";
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator";
import { ICredential } from "src/auth/application/model/credential.interface";
import { CreatePaymentMethodInfraestructureRequestDTO } from "../dto/create-payment-method-entry.dto";
import { CreatePaymentMethodRequestDto } from "src/payment-methods/application/dto/request/create-payment-method-request-dto";
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator";
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator";
import { NestLogger } from "src/common/infraestructure/logger/nest-logger";
import { CreatePaymentMethodApplicationService } from "src/payment-methods/application/service/create-payment-method.application.service";
import { CloudinaryService } from "src/common/infraestructure/file-uploader/cloudinary-uploader";
import { FileInterceptor } from "@nestjs/platform-express";
import { FindAllPaymentMethodEntryDto } from "../dto/find-all-payment-method.dto";
import { FindAllPaymentMethodRequestDto } from "src/payment-methods/application/dto/request/find-all-payment-method-request.dto";
import { FindAllPaymentMethodApplicationService } from "src/payment-methods/application/service/find-all-payment-method.application.service";
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator";
import { NestTimer } from "src/common/infraestructure/timer/nets-timer";
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository";
import { IAuditRepository } from "src/common/application/repositories/audit.repository";
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler";
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator";
import { DisablePaymentMethodInfraestructureRequestDTO } from "../dto/entry/disable-payment-method-entry.dto";
import { DisablePaymentMethodRequestDto } from "src/payment-methods/application/dto/request/disable-payment-method-request-dto";
import { DisablePaymentMethodApplicationService } from "src/payment-methods/application/service/disable-payment-method.application.service";
import { AvailablePaymentMethodRequestDto } from "src/payment-methods/application/dto/request/aviable-payment-method-request-dto";
import { PaymentMethodQueues } from "../queues/payment-method-queues";
import { RabbitMQSubscriber } from "src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber";
import { IPaymentMethodRegistered } from "../interface/payment-method-registered.interface";
import { IPaymentMethodStateUpdated } from "../interface/payment-method-state-updated.interface";
import { PaymentMethodRegisteredSyncroniceService } from "../services/syncronice/payment-method-registered-syncronice.service";
import { Mongoose } from "mongoose";
import { PaymentMethodRegistredInfraestructureRequestDTO } from "../services/dto/payment-method-registered-infraestructure-request-dto";
import { PaymentMethodStateUpdatedInfraestructureRequestDTO } from "../services/dto/payment-method-state-updated-infraestructure-request-dto";
import { PaymentStateUpdatedSyncroniceService } from "../services/syncronice/payment-method-state-updated-syncronice.service";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { OdmPaymentMethodQueryRepository } from "../repository/odm-repository/odm-payment-method-query-repository";
import { AvailablePaymentMethodApplicationService } from "src/payment-methods/application/service/available-payment-method.application.service";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Payment Method')
@Controller('payment/method')
export class PaymentMethodController {

    private readonly auditRepository: IAuditRepository;

    //*Mappers
    private readonly paymentMethodMapper: IMapper<PaymentMethodAgregate,PaymentMethodEntity>;

    //*Repositories
    private readonly paymentMethodRepository: IPaymentMethodRepository;
    private readonly paymentMethodQueryRepository: IPaymentMethodQueryRepository;

    //*IdGen
    private readonly idGen: IIdGen<string>;

    //*RabbitMQ
    private readonly rabbitMq: IEventPublisher;
    private readonly subscriber: RabbitMQSubscriber;

    private initializeQueues():void{        
        PaymentMethodQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
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
        @Inject("MONGO_CONNECTION") private readonly mongoose: Mongoose,
    ) {

        this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())

        //*IdGen
        this.idGen = new UuidGen();

        //*RabbitMQ
        this.rabbitMq = new RabbitMQPublisher(this.channel);

        //*Mappers
        this.paymentMethodMapper = new OrmPaymentMethodMapper();

        //*Repositories
        this.paymentMethodRepository = new OrmPaymentMethodRepository(PgDatabaseSingleton.getInstance(),this.paymentMethodMapper);
        //this.paymentMethodQueryRepository = new OrmPaymentMethodQueryRepository(PgDatabaseSingleton.getInstance(),this.paymentMethodMapper);
    
        this.paymentMethodQueryRepository = new OdmPaymentMethodQueryRepository(this.mongoose);

        this.subscriber= new RabbitMQSubscriber(this.channel);

        this.initializeQueues();
        
        this.subscriber.consume<IPaymentMethodRegistered>(
            { name: 'PaymentMethodSync/PaymentMethodRegistered'}, 
            (data):Promise<void>=>{
                this.syncPaymentMethodRegistered(data)
                return
            }
        )
        
        this.subscriber.consume<IPaymentMethodStateUpdated>(
            { name: 'PaymentMethodSync/AvailablePayment'}, 
            (data):Promise<void>=>{
                this.syncPaymentMethodStateUpdated(data)
                return
            }
        )
        
        this.subscriber.consume<IPaymentMethodStateUpdated>(
            { name: 'PaymentMethodSync/DisablePayment'}, 
            (data):Promise<void>=>{
                this.syncPaymentMethodStateUpdated(data)
                return
            }
        )
    
    }

    async syncPaymentMethodRegistered(data:IPaymentMethodRegistered){
        let service= new PaymentMethodRegisteredSyncroniceService(this.mongoose)
        
        let request: PaymentMethodRegistredInfraestructureRequestDTO = {
            id: data.paymentMethodId,
            name: data.paymentMethodName,
            state: data.paymentMethodState,
            imageUrl: data.paymentMethodImage
        }
        
        await service.execute(request)
    }

    async syncPaymentMethodStateUpdated(data:IPaymentMethodStateUpdated){
        let service= new PaymentStateUpdatedSyncroniceService(this.mongoose)
        
        let request: PaymentMethodStateUpdatedInfraestructureRequestDTO = {
            id: data.paymentMethodId,
            state: data.paymentMethodState,
        }
        
        await service.execute(request)
    }


    @Post('/create')
    @UseInterceptors(FileInterceptor('image')) 
    async createPaymentMethod(
        @GetCredential() credential:ICredential,
        @Body() data: CreatePaymentMethodInfraestructureRequestDTO,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                    fileType:/(jpeg|.jpg|.png)$/
                    }),
                ]
            }),
        ) image: Express.Multer.File) {
        let method: CreatePaymentMethodRequestDto = {
            userId: credential.account.idUser,
            name: data.name,
            image: image.buffer
        }

        let payOrderService = new ExceptionDecorator(
            new AuditDecorator(
                new PerformanceDecorator(
                    new CreatePaymentMethodApplicationService(
                        this.paymentMethodRepository,
                        this.paymentMethodQueryRepository,
                        this.rabbitMq,
                        this.idGen,
                        new CloudinaryService()
                    ),new NestTimer(),new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );


        let response = await payOrderService.execute(method);
        
        return response.getValue;
    }

    @Get('/many')
    async findAllPaymentMethods(
        @GetCredential() credential:ICredential,
        @Query() data: FindAllPaymentMethodEntryDto
    ) {
                
        if (!data.page) data.page = 1;
        if (!data.perpage) data.perpage = 10;

        let values: FindAllPaymentMethodRequestDto = {
            userId: credential.account.idUser,
            page:data.page,
            perPage:data.perpage
        }


        
        
        let getAllPaymentMethodService = new ExceptionDecorator(
            new LoggerDecorator(
                new PerformanceDecorator(
                    new FindAllPaymentMethodApplicationService(
                        this.paymentMethodQueryRepository
                    ),
                    new NestTimer(),new NestLogger(new Logger())
                ),
                new NestLogger(new Logger())
            )
        );

        let response = await getAllPaymentMethodService.execute(values);
        
        return response.getValue;
    }

    @Post('/disable') 
    async DisablePaymentMethod(
        @GetCredential() credential:ICredential,
        @Body() data: DisablePaymentMethodInfraestructureRequestDTO,
        ) {
        let method: DisablePaymentMethodRequestDto = {
            userId: credential.account.idUser,
            paymentMethodId: data.id_payment_method
        }

        let disable = new ExceptionDecorator(
            new AuditDecorator(
                new PerformanceDecorator(
                    new DisablePaymentMethodApplicationService(
                        this.paymentMethodRepository,
                        this.paymentMethodQueryRepository,
                        this.rabbitMq,
                    ),new NestTimer(),new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );


        let response = await disable.execute(method);
        
        return response.getValue;
    }

    @Post('/avaliable') 
    async AvailablePaymentMethod(
        @GetCredential() credential:ICredential,
        @Body() data: DisablePaymentMethodInfraestructureRequestDTO,
        ) {
        let method: AvailablePaymentMethodRequestDto = {
            userId: credential.account.idUser,
            paymentMethodId: data.id_payment_method
        }

        let disable = new ExceptionDecorator(
            new AuditDecorator(
                new PerformanceDecorator(
                    new AvailablePaymentMethodApplicationService(
                        this.paymentMethodRepository,
                        this.paymentMethodQueryRepository,
                        this.rabbitMq,
                    ),new NestTimer(),new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );


        let response = await disable.execute(method);
        
        return response.getValue;
    }

}