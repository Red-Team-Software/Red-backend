import { Body, Controller, Get, Inject, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StripeSingelton } from "src/payments/infraestructure/stripe-singelton";
import { PaymentEntryDto } from "../dto/payment-entry-dto";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator";
import { PayOrderAplicationService } from "src/Order/application/service/pay-order-application.service";
import { EventBus } from "src/common/infraestructure/events/publishers/event-bus";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services";
import { OrderPayApplicationServiceRequestDto } from "src/Order/application/dto/request/order-pay-request-dto";
import { OrderPayResponseDto } from "src/Order/application/dto/response/order-pay-response-dto";
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator";
import { ICalculateShippingFee } from "src/Order/domain/domain-services/calculate-shippping-fee.interfafe";
import { ICalculateTaxesFee } from "src/Order/domain/domain-services/calculate-taxes-fee.interface";
import { IPaymentService } from "src/Order/domain/domain-services/payment-interface";
import { CalculateTaxesFeeImplementation } from "../domain-service/calculate-tax-fee-implementation";
import { NestLogger } from "src/common/infraestructure/logger/nest-logger";
import { CalculateShippingFeeHereMaps } from "../domain-service/calculate-shipping-here-maps";
import { HereMapsSingelton } from '../../../payments/infraestructure/here-maps-singleton';
import { PaymentOrderImplementation } from "../domain-service/payment-order-implementation";
import { TaxesShippingFeeEntryDto } from "../dto/taxes-shipping-dto";
import { TaxesShippingFeeApplicationServiceEntryDto } from "src/Order/application/dto/request/tax-shipping-fee-request-dto";
import { CalculateTaxesShippingResponseDto } from "src/Order/application/dto/response/calculate-taxes-shipping-fee-response.dto";
import { CalculateTaxShippingFeeAplicationService } from "src/Order/application/service/calculate-tax-shipping-fee-application.service";
import { ICommandOrderRepository } from "src/Order/domain/command-repository/order-command-repository-interface";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Order } from "src/Order/domain/aggregate/order";
import { OrmOrderEntity } from "../entities/orm-order-entity";
import { OrmOrderMapper } from "../mappers/order-mapper";
import { OrderQueryRepository } from "../repositories/orm-repository/orm-order-query-repository";
import { OrmOrderRepository } from "../repositories/orm-repository/orm-order-repository";
import { PgDatabaseSingleton } from "src/common/infraestructure/database/pg-database.singleton";
import { IQueryOrderRepository } from "src/Order/application/query-repository/order-query-repository-interface";
import { FindAllOrdersEntryDto } from "../dto/find-all-orders.dto";
import { FindAllOrdersApplicationServiceRequestDto } from "src/Order/application/dto/request/find-all-orders-request.dto";
import { FindAllOrdersApplicationServiceResponseDto } from "src/Order/application/dto/response/find-all-orders-response.dto";
import { FindAllOdersApplicationService } from "src/Order/application/service/find-all-orders-application.service";
import { Channel } from 'amqplib';
import { RabbitMQPublisher } from "src/common/infraestructure/events/publishers/rabbit-mq-publisher";

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
    private readonly paymentConnection: IPaymentService;
    
    //*Aplication services
    private readonly payOrderService: IApplicationService<OrderPayApplicationServiceRequestDto,OrderPayResponseDto>;
    private readonly calculateTaxesShippingFee: IApplicationService<TaxesShippingFeeApplicationServiceEntryDto,CalculateTaxesShippingResponseDto>;
    private readonly getAllOrders: IApplicationService<FindAllOrdersApplicationServiceRequestDto,FindAllOrdersApplicationServiceResponseDto>;

    //*Repositories
    private readonly orderRepository: ICommandOrderRepository;
    private readonly orderQueryRepository: IQueryOrderRepository;


    private readonly idGen: IIdGen<string>;

    //*RabbitMQ
    private readonly rabbitMq: IEventPublisher;


    constructor(
        @Inject("RABBITMQ_CONNECTION") private readonly channel: Channel
    ) {
        this.idGen = new UuidGen();
        this.stripeSingleton = StripeSingelton.getInstance();
        this.rabbitMq = new RabbitMQPublisher(this.channel);
        this.hereMapsSingelton = HereMapsSingelton.getInstance(); 
        this.calculateShipping = new CalculateShippingFeeHereMaps(this.hereMapsSingelton);
        this.calculateTax = new CalculateTaxesFeeImplementation();
        this.paymentConnection = new PaymentOrderImplementation(this.stripeSingleton);
        this.orderMapper = new OrmOrderMapper(this.idGen);
    
        this.orderQueryRepository = new OrderQueryRepository(PgDatabaseSingleton.getInstance(),this.orderMapper);
        this.orderRepository = new OrmOrderRepository(PgDatabaseSingleton.getInstance(),this.orderMapper);



        //*Pay Service
        this.payOrderService = new ExceptionDecorator(
            new LoggerDecorator(
                new PayOrderAplicationService(
                    this.rabbitMq,
                    this.calculateShipping,
                    this.calculateTax,
                    this.paymentConnection,
                    this.orderRepository,
                    this.idGen
                ),
                new NestLogger(new Logger())
            )
        )

        //*Calculate Taxes and Shipping Fee
        this.calculateTaxesShippingFee = new ExceptionDecorator(
            new LoggerDecorator(
                new CalculateTaxShippingFeeAplicationService(
                    this.calculateShipping,
                    this.calculateTax
                ),
                new NestLogger(new Logger())
            )
        )

        //*fins All Orders
        this.getAllOrders = new ExceptionDecorator(
            new LoggerDecorator(
                new FindAllOdersApplicationService(
                    this.orderQueryRepository
                ),
                new NestLogger(new Logger())
            )
        )
    }

    


    @Post('/payment')
    async realizePayment(@Body() data: PaymentEntryDto) {
        let payment: OrderPayApplicationServiceRequestDto = {
            userId: 'none',
            ...data}

        
        let response = await this.payOrderService.execute(payment);
        
        return response.getValue.paymentState;
    }

    @Get('/tax-shipping-fee')
    async calculateTaxesAndShipping(@Body() data: TaxesShippingFeeEntryDto) {
        let payment: TaxesShippingFeeApplicationServiceEntryDto = {
            userId: 'none',
            ...data
        }
        
        let response = await this.calculateTaxesShippingFee.execute(payment);
        
        return response.getValue;
    }

    @Get('/all')
    async findAllOrders(@Body() data: FindAllOrdersEntryDto) {
        let values: FindAllOrdersApplicationServiceRequestDto = {
            userId: 'none',
            ...data
        }
        
        let response = await this.getAllOrders.execute(values);
        
        return response.getValue;
    }



// @Post('/create-payment')
// async createPaymentIntent(@Body() data: PaymentEntryDto) {
//     try {
//         const paymentIntent =
//             await this.stripeSingleton.stripeInstance.paymentIntents.create({
//                 amount: data.amount,
//                 currency: data.currency,
//                 payment_method_types: ['card'],
//                 confirmation_method: 'manual',
//             });
//         let paymentIntentId = paymentIntent.id;
        
//         const confirmedPaymentIntent =
//             await this.stripeSingleton.stripeInstance.paymentIntents.confirm(
//                 paymentIntentId,
//                 {
//                     payment_method: data.paymentMethod,
//                 },
//             );
//         return confirmedPaymentIntent;
//     } catch (error) {
//         console.error('Error creating payment intent:', error);
//     }
// }
}
