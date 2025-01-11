import { Body, Controller, Get, Inject, Logger, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { StripeSingelton } from "src/common/infraestructure/stripe/stripe-singelton";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator";
import { PayOrderAplicationService } from "src/order/application/service/pay-order-application.service";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services";
import { OrderPayApplicationServiceRequestDto } from "src/order/application/dto/request/order-pay-request-dto";
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator";
import { ICalculateShippingFee } from "src/order/domain/domain-services/interfaces/calculate-shippping-fee.interface";
import { ICalculateTaxesFee } from "src/order/domain/domain-services/interfaces/calculate-taxes-fee.interface";
import { CalculateTaxesFeeImplementation } from "../domain-service/calculate-tax-fee-implementation";
import { NestLogger } from "src/common/infraestructure/logger/nest-logger";
import { CalculateShippingFeeHereMaps } from "../domain-service/calculate-shipping-here-maps";
import { HereMapsSingelton } from '../../../common/infraestructure/here-maps/here-maps-singleton';
import { TaxesShippingFeeEntryDto } from "../dto/taxes-shipping-dto";
import { TaxesShippingFeeApplicationServiceEntryDto } from "src/order/application/dto/request/tax-shipping-fee-request-dto";
import { CalculateTaxesShippingResponseDto } from "src/order/application/dto/response/calculate-taxes-shipping-fee-response.dto";
import { CalculateTaxShippingFeeAplicationService } from "src/order/application/service/calculate-tax-shipping-fee-application.service";
import { ICommandOrderRepository } from "src/order/domain/command-repository/order-command-repository-interface";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Order } from "src/order/domain/aggregate/order";
import { OrmOrderEntity } from "../entities/orm-order-entity";
import { OrmOrderMapper } from "../mappers/order-mapper";
import { OrderQueryRepository } from "../repositories/orm-repository/orm-order-query-repository";
import { OrmOrderRepository } from "../repositories/orm-repository/orm-order-repository";
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton";
import { IQueryOrderRepository } from "src/order/application/query-repository/order-query-repository-interface";
import { FindAllOrdersEntryDto } from "../dto/find-all-orders.dto";
import { FindAllOrdersApplicationServiceRequestDto } from "src/order/application/dto/request/find-all-orders-request.dto";
import { FindAllOrdersApplicationServiceResponseDto } from "src/order/application/dto/response/find-all-orders-response.dto";
import { FindAllOdersApplicationService } from "src/order/application/service/find-all-orders-application.service";
import { Channel } from 'amqplib';
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher";
import { IGeocodification } from "src/order/domain/domain-services/interfaces/geocodification-interface";
import { GeocodificationHereMapsDomainService } from "../domain-service/geocodification-here-maps-domain-service";
import { OrmProductQueryRepository } from "src/product/infraestructure/repositories/orm-repository/orm-product-query-repository";
import { CancelOrderApplicationServiceRequestDto } from "src/order/application/dto/request/cancel-order-request-dto";
import { CancelOrderApplicationServiceResponseDto } from "src/order/application/dto/response/cancel-order-response-dto";
import { CancelOderApplicationService } from "src/order/application/service/cancel-order-application.service";
import { CancelOrderDto } from "../dto/cancel-order-entry.dto";
import { StripePayOrderMethod } from "../domain-service/pay-order-stripe-method";
import { CreateOrderReportApplicationServiceResponseDto } from "src/order/application/dto/response/create-order-report-response.dto";
import { CreateOrderReportApplicationServiceRequestDto } from "src/order/application/dto/request/create-order-report-request-dto";
import { CreateReportApplicationService } from "src/order/application/service/create-report-application.service";
import { CreateReportEntryDto } from "../dto/create-report-entry.dto";
import { RefundPaymentStripeConnection } from "../domain-service/refund-amount-stripe";
import { ICourierRepository } from "src/courier/domain/repositories/courier-repository-interface";
import { OrmCourierMapper } from "src/courier/infraestructure/mapper/orm-courier-mapper/orm-courier-mapper";
import { CourierRepository } from "src/courier/infraestructure/repository/orm-repository/orm-courier-repository";
import { ICourierQueryRepository } from "src/courier/application/query-repository/courier-query-repository-interface";
import { CourierQueryRepository } from "src/courier/infraestructure/repository/orm-repository/orm-courier-query-repository";
import { GetCredential } from "src/auth/infraestructure/jwt/decorator/get-credential.decorator";
import { ICredential } from "src/auth/application/model/credential.interface";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/guards/jwt-auth.guard";
import { IQueryUserRepository } from "src/user/application/repository/user.query.repository.interface";
import { OrmUserQueryRepository } from "src/user/infraestructure/repositories/orm-repository/orm-user-query-repository";
import { DateHandler } from "src/common/infraestructure/date-handler/date-handler";
import { FindOrderByIdRequestDto } from "src/order/application/dto/request/find-order-by-id-request-dto";
import { FindOrderByIdApplicationService } from "src/order/application/service/find-order-by-id-application.service";
import { IQueryProductRepository } from "src/product/application/query-repository/query-product-repository";
import { IQueryBundleRepository } from "src/bundle/application/query-repository/query-bundle-repository";
import { OrmBundleQueryRepository } from "src/bundle/infraestructure/repositories/orm-repository/orm-bundle-query-repository";
import { OrmPromotionQueryRepository } from "src/promotion/infraestructure/repositories/orm-repository/orm-promotion-query-repository";
import { FindAllOrdersByUserInfraestructureEntryDto } from "../dto/find-all-orders-by-user-ifraestructure-request-dto";
import { PerformanceDecorator } from "src/common/application/aspects/performance-decorator/performance-decorator";
import { NestTimer } from "src/common/infraestructure/timer/nets-timer";
import { FindAllOdersByUserApplicationService } from "src/order/application/service/find-all-orders-by-user-application.service";
import { IPaymentMethodQueryRepository } from "src/payment-methods/application/query-repository/orm-query-repository.interface";
import { OrmPaymentMethodMapper } from "src/payment-methods/infraestructure/mapper/orm-mapper/orm-payment-method-mapper";
import { OrmPaymentMethodQueryRepository } from "src/payment-methods/infraestructure/repository/orm-repository/orm-payment-method-query-repository";
import { DeliveredOrderApplicationServiceRequestDto } from "src/order/application/dto/request/delivered-order-request-dto";
import { DeliveredOrderDto } from "../dto/delivered-order-entry.dto";
import { DeliveredOderApplicationService } from "src/order/application/service/delivered-order-application.service";
import { PaymentEntryDto } from "../dto/payment-entry-dto";
import { WalletPaymentMethod } from "../domain-service/wallet-method";
import { ICommandUserRepository } from "src/user/domain/repository/user.command.repository.interface";
import { OrmUserCommandRepository } from "src/user/infraestructure/repositories/orm-repository/orm-user-command-repository";
import { OrmTransactionCommandRepository } from "src/user/infraestructure/repositories/orm-repository/orm-transaction-command-repository";
import { ICommandTransactionRepository } from "src/user/application/repository/wallet-transaction/transaction.command.repository.interface";
import { ITransaction } from "src/user/application/model/transaction-interface";
import { WalletPaymentEntryDto } from "../dto/wallet-payment-entry-dto";
import { OrderQueues } from "../queues/order.queues";
import { RabbitMQSubscriber } from "src/common/infraestructure/events/subscriber/rabbitmq/rabbit-mq-subscriber";
import { ICreateOrder } from "src/product/infraestructure/interfaces/create-order.interface";
import { ICancelOrder } from "src/notification/infraestructure/interfaces/cancel-order.interface";
import { RefundPaymentApplicationService } from "src/order/application/service/refund-payment-application.service";
import { RefundPaymentApplicationServiceRequestDto } from "src/order/application/dto/request/refund-payment-request-dto";
import { AssignCourierDto } from "../dto/delivering-order-entry.dto";
import { AssignCourierApplicationServiceRequestDto } from "src/order/application/dto/request/assign-courier-request-dto";
import { AssignCourierApplicationService } from "src/order/application/service/assign-courier-application.service";
import { AuditDecorator } from "src/common/application/aspects/audit-decorator/audit-decorator";
import { IAuditRepository } from "src/common/application/repositories/audit.repository";
import { OrmAuditRepository } from "src/common/infraestructure/repository/orm-repository/orm-audit.repository";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Order')
@Controller('order')
export class OrderController {

    //*Mappers
    private readonly orderMapper: IMapper<Order,OrmOrderEntity>;

    //*Singeltons
    private readonly stripeSingleton: StripeSingelton;
    private readonly hereMapsSingelton: HereMapsSingelton;
    
    //*Domain services
    private readonly calculateShipping: ICalculateShippingFee;
    private readonly calculateTax: ICalculateTaxesFee;
    private readonly geocodificationAddress: IGeocodification;
    
    //*Repositories
    private readonly orderRepository: ICommandOrderRepository;
    private readonly orderQueryRepository: IQueryOrderRepository;
    private readonly ormProductRepository: IQueryProductRepository;
    private readonly ormBundleRepository: IQueryBundleRepository;
    private readonly ormCourierRepository: ICourierRepository;
    private readonly ormCourierQueryRepository: ICourierQueryRepository;
    private readonly ormUserCommandRepo:ICommandUserRepository;
    private readonly ormUserQueryRepository: IQueryUserRepository;
    private readonly paymentMethodQueryRepository: IPaymentMethodQueryRepository;
    private TransactionCommandRepository: ICommandTransactionRepository<ITransaction>;
    private readonly auditRepository: IAuditRepository

    //*IdGen
    private readonly idGen: IIdGen<string>;

    //*RabbitMQ
    private readonly rabbitMq: IEventPublisher;
    private readonly subscriber: RabbitMQSubscriber;


    private initializeQueues():void{        
        OrderQueues.forEach(queue => this.buildQueue(queue.name, queue.pattern))
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
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ) {
        //*IdGen
        this.idGen = new UuidGen();

        //*implementations of singeltons
        this.stripeSingleton = StripeSingelton.getInstance();
        this.hereMapsSingelton = HereMapsSingelton.getInstance();

        //*RabbitMQ
        this.rabbitMq = new RabbitMQPublisher(this.channel);
        this.subscriber= new RabbitMQSubscriber(this.channel)

        //*implementations of domain services
        this.calculateShipping = new CalculateShippingFeeHereMaps(this.hereMapsSingelton);
        this.calculateTax = new CalculateTaxesFeeImplementation();
        this.geocodificationAddress = new GeocodificationHereMapsDomainService(this.hereMapsSingelton);
        
        this.auditRepository= new OrmAuditRepository(PgDatabaseSingleton.getInstance())
        

        //*Repositories
        this.TransactionCommandRepository = new OrmTransactionCommandRepository(PgDatabaseSingleton.getInstance());
        this.ormProductRepository = new OrmProductQueryRepository(PgDatabaseSingleton.getInstance());
        this.ormBundleRepository = new OrmBundleQueryRepository(PgDatabaseSingleton.getInstance());
        this.ormCourierRepository = new CourierRepository(
            PgDatabaseSingleton.getInstance(),
            new OrmCourierMapper(this.idGen)
        );
        this.ormCourierQueryRepository = new CourierQueryRepository(
            PgDatabaseSingleton.getInstance(),
            new OrmCourierMapper(this.idGen)
        );
        this.ormUserQueryRepository = new OrmUserQueryRepository(
            PgDatabaseSingleton.getInstance()
        );
        this.paymentMethodQueryRepository=new OrmPaymentMethodQueryRepository(
            PgDatabaseSingleton.getInstance(),
            new OrmPaymentMethodMapper()
        )
        this.ormUserCommandRepo=new OrmUserCommandRepository(PgDatabaseSingleton.getInstance())

        //*Mappers
        this.orderMapper = new OrmOrderMapper(
            this.idGen,
            this.ormProductRepository,
            this.ormBundleRepository,
            this.ormCourierRepository,
            this.ormUserQueryRepository
        );

        //*Repositories
        this.orderQueryRepository = new OrderQueryRepository(PgDatabaseSingleton.getInstance(),this.orderMapper);
        this.orderRepository = new OrmOrderRepository(PgDatabaseSingleton.getInstance(),this.orderMapper);

        this.initializeQueues();

        this.subscriber.consume<ICancelOrder>(
            { name: 'WalletRefund/OrderStatusCancelled'}, 
            (data):Promise<void>=>{
                console.log("hola")
                this.walletRefund(data)
                return
            }
        )

    }

    async walletRefund(data:ICancelOrder){
        let request: RefundPaymentApplicationServiceRequestDto = {
            userId: data.orderUserId,
            orderId: data.orderId
        }

        let refundService = new ExceptionDecorator(
            new LoggerDecorator(
                new PerformanceDecorator(
                    new RefundPaymentApplicationService(
                        this.orderQueryRepository,
                        this.rabbitMq,
                        new RefundPaymentStripeConnection(this.stripeSingleton),
                        this.ormUserCommandRepo,
                        this.ormUserQueryRepository,
                        this.TransactionCommandRepository,
                        this.idGen
                    ),new NestTimer(),new NestLogger(new Logger())
                ),
                new NestLogger(new Logger())
            )
        );
        
        await refundService.execute(request);
    }



    //@UseGuards(JwtAuthGuard)
    @Post('/pay/stripe')
    async realizePayment(
        @GetCredential() credential:ICredential,
        @Body() data: PaymentEntryDto
    ) {
        let payment: OrderPayApplicationServiceRequestDto = {
            userId: credential.account.idUser,
            paymentId: data.paymentId,
            currency: data.currency.toLowerCase(),
            paymentMethod: data.paymentMethod,
            address: data.address,
            products: data.products,
            bundles: data.bundles,
            cuponId: data.cuponId,
        }

        let payOrderService = new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new PayOrderAplicationService(
                            this.rabbitMq,
                            this.calculateShipping,
                            this.calculateTax,
                            new StripePayOrderMethod(this.stripeSingleton, this.idGen, data.stripePaymentMethod),
                            this.orderRepository,
                            this.idGen,
                            this.geocodificationAddress,
                            this.ormProductRepository,
                            this.ormBundleRepository,
                            new DateHandler(),
                            new OrmPromotionQueryRepository(PgDatabaseSingleton.getInstance()),
                            this.paymentMethodQueryRepository
                        ),new NestTimer(),new NestLogger(new Logger())
                    ),
                    new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );

        let response = await payOrderService.execute(payment);
        
        return response.getValue;
    }


    @Post('/pay/wallet')
    async realizePaymentWallet(
        @GetCredential() credential:ICredential,
        @Body() data: WalletPaymentEntryDto
    ) {
        let payment: OrderPayApplicationServiceRequestDto = {
            userId: credential.account.idUser,
            paymentId: data.paymentId,
            currency: data.currency.toLowerCase(),
            paymentMethod: data.paymentMethod,
            address: data.address,
            products: data.products,
            bundles: data.bundles,
            cuponId: data.cuponId
        }

        let payOrderService = new ExceptionDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new PerformanceDecorator(
                        new PayOrderAplicationService(
                            this.rabbitMq,
                            this.calculateShipping,
                            this.calculateTax,
                            new WalletPaymentMethod(
                                this.idGen, 
                                this.ormUserQueryRepository,
                                this.ormUserCommandRepo,
                                this.TransactionCommandRepository
                            ),
                            this.orderRepository,
                            this.idGen,
                            this.geocodificationAddress,
                            this.ormProductRepository,
                            this.ormBundleRepository,
                            new DateHandler(),
                            new OrmPromotionQueryRepository(PgDatabaseSingleton.getInstance()),
                            this.paymentMethodQueryRepository
                        ),new NestTimer(),new NestLogger(new Logger())
                    ),
                    new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );

        

        let response = await payOrderService.execute(payment);
        
        return response.getValue;
    }


    @Post('/tax-shipping-fee')
    async calculateTaxesAndShipping(
        @GetCredential() credential:ICredential,
        @Body() data: TaxesShippingFeeEntryDto
    ) {
        let payment: TaxesShippingFeeApplicationServiceEntryDto = {
            userId: credential.account.idUser,
            amount: data.amount,
            currency: data.currency.toLowerCase(),
            address: data.address,
        }

        let calculateTaxesShippingFee = new ExceptionDecorator(
            new LoggerDecorator(
                new PerformanceDecorator(
                    new CalculateTaxShippingFeeAplicationService(
                        this.calculateShipping,
                        this.calculateTax,
                        this.geocodificationAddress,
                    ),new NestTimer(),new NestLogger(new Logger())
                ),
                new NestLogger(new Logger())
            )
        );
        
        let response = await calculateTaxesShippingFee.execute(payment);
        
        return response.getValue;
    }

    @Get('/many')
    async findAllOrders(
        @GetCredential() credential:ICredential,
        @Query() data: FindAllOrdersEntryDto
    ) {
        let values: FindAllOrdersApplicationServiceRequestDto = {
            userId: credential.account.idUser,
            ...data
        }

        let getAllOrders = new ExceptionDecorator(
            new LoggerDecorator(
                new PerformanceDecorator(
                    new FindAllOdersApplicationService(
                        this.orderQueryRepository,
                        this.ormProductRepository,
                        this.ormBundleRepository,
                        this.ormCourierQueryRepository
                    ),new NestTimer(),new NestLogger(new Logger())
                ),
                new NestLogger(new Logger())
            )
        );

        if(!data.page)
            values.page=1
          if(!data.perPage)
            values.perPage=10
        
        let response = await getAllOrders.execute(values);
        
        return response.getValue;
    }

    @Get('/user/many')
    async findAllByUserOrders(
        @GetCredential() credential:ICredential,
        @Query() data: FindAllOrdersByUserInfraestructureEntryDto
    ) {
        let values: FindAllOrdersApplicationServiceRequestDto = {
            userId: credential.account.idUser,
            ...data
        }

        if(!data.page)
            values.page=1
        if(!data.perPage)
            values.perPage=10
        
        let service=
        new ExceptionDecorator(
            new LoggerDecorator(
                new PerformanceDecorator(
                    new FindAllOdersByUserApplicationService(
                        this.orderQueryRepository,
                        this.ormProductRepository,
                        this.ormBundleRepository,
                        this.ormCourierQueryRepository
                    ), new NestTimer(), new NestLogger(new Logger())
                ),new NestLogger(new Logger())
            )
        )
        
        let response=await service.execute({...data,userId:credential.account.idUser})
        return response.getValue
    }

    @Get('/cancel/:orderId')
    async cancelOrder(
        @GetCredential() credential:ICredential,
        @Param() data: CancelOrderDto) {
        let request: CancelOrderApplicationServiceRequestDto = {
            userId: credential.account.idUser,
            orderId: data.orderId
        }

        let orderCancelled = new ExceptionDecorator(
            new AuditDecorator(
                    new PerformanceDecorator(
                        new CancelOderApplicationService(
                            this.orderQueryRepository,
                            this.orderRepository,
                            this.rabbitMq
                        ),new NestTimer(),new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );
        
        let response = await orderCancelled.execute(request);
        
        return response.getValue;
    }

    @Post('/assign-courier')
    async assignCourierOrder(
        @GetCredential() credential:ICredential,
        @Body() data: AssignCourierDto) {
        
            let request: AssignCourierApplicationServiceRequestDto = {
            userId: credential.account.idUser,
            orderId: data.orderId,
            courierId: data.courierId
        }

        let orderDelivering = new ExceptionDecorator(
            new AuditDecorator(
                new PerformanceDecorator(
                    new AssignCourierApplicationService(
                        this.orderQueryRepository,
                        this.orderRepository,
                        this.rabbitMq,
                        this.ormCourierQueryRepository
                    ),new NestTimer(),new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );
        
        let response = await orderDelivering.execute(request);
        
        return response.getValue;
    }

    @Post('/delivered/order')
    async deliveredOrder(
        @GetCredential() credential:ICredential,
        @Body() data: DeliveredOrderDto) {
        
            let request: DeliveredOrderApplicationServiceRequestDto = {
            userId: credential.account.idUser,
            orderId: data.orderId
        }

        let orderDelivered = new ExceptionDecorator(
            new AuditDecorator(
                new PerformanceDecorator(
                    new DeliveredOderApplicationService(
                        this.orderQueryRepository,
                        this.orderRepository,
                        this.rabbitMq
                    ),new NestTimer(),new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );
        
        let response = await orderDelivered.execute(request);
        
        return response.getValue;
    }

    @Post('/report/order')
    async reportOrder(
        @GetCredential() credential:ICredential,
        @Body() data: CreateReportEntryDto
    ) {
        let request: CreateOrderReportApplicationServiceRequestDto = {
            userId: credential.account.idUser,
            orderId: data.orderId,
            description: data.description
        }

        let createReport = new ExceptionDecorator(
            new AuditDecorator(
                new PerformanceDecorator(
                    new CreateReportApplicationService(
                        this.orderQueryRepository,
                        this.orderRepository,
                        this.rabbitMq,
                        this.idGen
                    ),new NestTimer(),new NestLogger(new Logger())
                ),this.auditRepository,new DateHandler()
            )
        );
        
        let response = await createReport.execute(request);
        
        return response.getValue;
    }

    @Get('/:id')
    async findOrderById(
        @GetCredential() credential:ICredential,
        @Param('id') id: string
    ) {
        let values: FindOrderByIdRequestDto = {
            userId: credential.account.idUser,
            orderId:id
        }
        
        let findById = new ExceptionDecorator(
            new LoggerDecorator(
                new PerformanceDecorator(
                    new FindOrderByIdApplicationService(
                        this.orderQueryRepository,
                        this.ormProductRepository,
                        this.ormBundleRepository,
                        this.ormCourierQueryRepository
                    ),new NestTimer(),new NestLogger(new Logger())
                ),
                new NestLogger(new Logger())
            )
        );

        let response = await findById.execute(values);
        
        return response.getValue;
    }

}
