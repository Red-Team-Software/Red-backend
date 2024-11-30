import { Body, Controller, Get, Inject, Logger, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StripeSingelton } from "src/payments/infraestructure/stripe-singelton";
import { StripePaymentEntryDto } from "../dto/stripe-payment-entry-dto";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator";
import { PayOrderAplicationService } from "src/order/application/service/pay-order-application.service";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services";
import { OrderPayApplicationServiceRequestDto } from "src/order/application/dto/request/order-pay-request-dto";
import { OrderPayResponseDto } from "src/order/application/dto/response/order-pay-response-dto";
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator";
import { ICalculateShippingFee } from "src/order/domain/domain-services/calculate-shippping-fee.interfafe";
import { ICalculateTaxesFee } from "src/order/domain/domain-services/calculate-taxes-fee.interface";
import { CalculateTaxesFeeImplementation } from "../domain-service/calculate-tax-fee-implementation";
import { NestLogger } from "src/common/infraestructure/logger/nest-logger";
import { CalculateShippingFeeHereMaps } from "../domain-service/calculate-shipping-here-maps";
import { HereMapsSingelton } from '../../../payments/infraestructure/here-maps-singleton';
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
import { IGeocodification } from "src/order/domain/domain-services/geocodification-interface";
import { GeocodificationHereMapsDomainService } from "../domain-service/geocodification-here-maps-domain-service";
import { IProductRepository } from "src/product/domain/repository/product.interface.repositry";
import { OrmProductRepository } from "src/product/infraestructure/repositories/orm-repository/orm-product-repository";
import { IBundleRepository } from "src/bundle/domain/repository/product.interface.repositry";
import { OrmBundleRepository } from "src/bundle/infraestructure/repositories/orm-repository/orm-bundle-repository";
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
    
    //*Aplication services
    private readonly calculateTaxesShippingFee: IApplicationService<TaxesShippingFeeApplicationServiceEntryDto,CalculateTaxesShippingResponseDto>;
    private readonly getAllOrders: IApplicationService<FindAllOrdersApplicationServiceRequestDto,FindAllOrdersApplicationServiceResponseDto>;
    private readonly orderCanceled: IApplicationService<CancelOrderApplicationServiceRequestDto,CancelOrderApplicationServiceResponseDto>;
    private readonly createReport: IApplicationService<CreateOrderReportApplicationServiceRequestDto,CreateOrderReportApplicationServiceResponseDto>;

    //*Repositories
    private readonly orderRepository: ICommandOrderRepository;
    private readonly orderQueryRepository: IQueryOrderRepository;
    private readonly ormProductRepository: IProductRepository;
    private readonly ormBundleRepository: IBundleRepository;

    //*IdGen
    private readonly idGen: IIdGen<string>;

    //*RabbitMQ
    private readonly rabbitMq: IEventPublisher;


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

        //*implementations of domain services
        this.calculateShipping = new CalculateShippingFeeHereMaps(this.hereMapsSingelton);
        this.calculateTax = new CalculateTaxesFeeImplementation();
        this.geocodificationAddress = new GeocodificationHereMapsDomainService(this.hereMapsSingelton);
        
        //*Repositories
        this.ormProductRepository = new OrmProductRepository(PgDatabaseSingleton.getInstance());
        this.ormBundleRepository = new OrmBundleRepository(PgDatabaseSingleton.getInstance());

        //*Mappers
        this.orderMapper = new OrmOrderMapper(this.idGen,this.ormProductRepository,this.ormBundleRepository);

        //*Repositories
        this.orderQueryRepository = new OrderQueryRepository(PgDatabaseSingleton.getInstance(),this.orderMapper);
        this.orderRepository = new OrmOrderRepository(PgDatabaseSingleton.getInstance(),this.orderMapper);


        //*Pay Service
        

        //*Calculate Taxes and Shipping Fee
        this.calculateTaxesShippingFee = new ExceptionDecorator(
            new LoggerDecorator(
                new CalculateTaxShippingFeeAplicationService(
                    this.calculateShipping,
                    this.calculateTax,
                    this.geocodificationAddress,
                ),
                new NestLogger(new Logger())
            )
        );

        //*fins All Orders
        this.getAllOrders = new ExceptionDecorator(
            new LoggerDecorator(
                new FindAllOdersApplicationService(
                    this.orderQueryRepository,
                    this.ormProductRepository,
                    this.ormBundleRepository
                ),
                new NestLogger(new Logger())
            )
        );

        //*order canceled

        this.orderCanceled = new ExceptionDecorator(
            new LoggerDecorator(
                new CancelOderApplicationService(
                    this.orderQueryRepository,
                    this.orderRepository,
                    this.rabbitMq,
                    new RefundPaymentStripeConnection(this.stripeSingleton)
                ),
                new NestLogger(new Logger())
            )
        );


        //*Create Report
        this.createReport = new ExceptionDecorator(
            new LoggerDecorator(
                new CreateReportApplicationService(
                    this.orderQueryRepository,
                    this.orderRepository,
                    this.rabbitMq,
                    this.idGen
                ),
                new NestLogger(new Logger())
            )
        );
    }


    @Post('/pay/stripe')
    async realizePayment(@Body() data: StripePaymentEntryDto) {
        let payment: OrderPayApplicationServiceRequestDto = {
            userId: 'none',
            paymentId: data.paymentId,
            currency: data.currency.toLowerCase(),
            paymentMethod: data.paymentMethod,
            address: data.address,
            products: data.products,
            bundles: data.bundles
        }

        let payOrderService = new ExceptionDecorator(
            new LoggerDecorator(
                new PayOrderAplicationService(
                    this.rabbitMq,
                    this.calculateShipping,
                    this.calculateTax,
                    new StripePayOrderMethod(this.stripeSingleton, this.idGen, data.stripePaymentMethod),
                    this.orderRepository,
                    this.idGen,
                    this.geocodificationAddress,
                    this.ormProductRepository,
                    this.ormBundleRepository
                ),
                new NestLogger(new Logger())
            )
        );


        let response = await payOrderService.execute(payment);
        
        return response.getValue;
    }

    @Post('/tax-shipping-fee')
    async calculateTaxesAndShipping(@Body() data: TaxesShippingFeeEntryDto) {
        let payment: TaxesShippingFeeApplicationServiceEntryDto = {
            userId: 'none',
            amount: data.amount,
            currency: data.currency.toLowerCase(),
            address: data.address,
        }
        
        let response = await this.calculateTaxesShippingFee.execute(payment);
        
        return response.getValue;
    }

    @Get('/all')
    async findAllOrders(@Query() data: FindAllOrdersEntryDto) {
        let values: FindAllOrdersApplicationServiceRequestDto = {
            userId: 'none',
            ...data
        }
        
        let response = await this.getAllOrders.execute(values);
        
        return response.getValue;
    }

    @Post('/cancel-order')
    async cancelOrder(@Body() data: CancelOrderDto) {
        let request: CancelOrderApplicationServiceRequestDto = {
            userId: 'none',
            orderId: data.orderId
        }
        
        let response = await this.orderCanceled.execute(request);
        
        return response.getValue;
    }

    @Post('/report-order')
    async reportOrder(@Body() data: CreateReportEntryDto) {
        let request: CreateOrderReportApplicationServiceRequestDto = {
            userId: 'none',
            orderId: data.orderId,
            description: data.description
        }
        
        let response = await this.createReport.execute(request);
        
        return response.getValue;
    }

    // @Post('/refund/stripe')
    // async refundPayment(@Body() data: StripePaymentEntryDto) {
    //     try {

    //         const paymentIntents = await this.stripeSingleton.stripeInstance.paymentIntents.list({});

    //         const stripePaymentIntent = paymentIntents.data.find(
    //             (paymentIntent) => paymentIntent.metadata.orderId === data.paymentId,
    //         );

    //         const refund = await this.stripeSingleton.stripeInstance.refunds.create({
    //             payment_intent: stripePaymentIntent.id,
    //         });
    //         return refund.status;
    //     } catch (error) {
    //         return error;
    //     }
    // }

}
