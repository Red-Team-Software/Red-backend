import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StripeSingelton } from "src/payments/infraestructure/stripe-singelton";
import { PaymentEntryDto } from "../dto/payment-entry-dto";
import { IIdGen } from "src/common/application/id-gen/id-gen.interface";
import { UuidGen } from "src/common/infraestructure/id-gen/uuid-gen";
import { ExceptionDecorator } from "src/common/application/aspects/exeption-decorator/exception-decorator";
import { PayOrderAplicationService } from "src/Order/aplication/service/pay-order-aplication-service";
import { EventBus } from "src/common/infraestructure/events/publishers/event-bus";
import { IEventPublisher } from "src/common/application/events/event-publisher/event-publisher.abstract";
import { IApplicationService } from "src/common/application/services";
import { OrderPayRequestDto } from "src/Order/aplication/dto/request/order-pay-request-dto";
import { OrderPayResponseDto } from "src/Order/aplication/dto/response/order-pay-response-dto";
import { LoggerDecorator } from "src/common/application/aspects/logger-decorator/logger-decorator";
import { ICalculateShippingFee } from "src/Order/domain/domain-services/calculate-shippping-fee.interfafe";
import { ICalculateTaxesFee } from "src/Order/domain/domain-services/calculate-taxes-fee.interface";
import { IPaymentService } from "src/Order/domain/domain-services/payment-interface";
import { CalculateShippingFeeImplementation } from "../domain-service/calculate-shipping-fee-implementation";
import { CalculateTaxesFeeImplementation } from "../domain-service/calculate-tax-fee-implementation";
import { StripeConnection } from "../domain-service/stripe_adapter";
import { NestLogger } from "src/common/infraestructure/logger/nest-logger";

@ApiTags('Order')
@Controller('order')
export class OrderController {
    
    private readonly stripeSingleton: StripeSingelton ;
    private readonly idGen: IIdGen<string>;
    private readonly eventBus: IEventPublisher;
    private readonly calculateShipping: ICalculateShippingFee;
    private readonly calculateTax: ICalculateTaxesFee;
    private readonly paymentConnection: IPaymentService;

    //Aplication services
    private readonly payOrderService: IApplicationService<OrderPayRequestDto,OrderPayResponseDto>;

    constructor() {
        this.idGen = new UuidGen();
        this.stripeSingleton = StripeSingelton.getInstance();
        this.eventBus = new EventBus();
        this.calculateShipping = new CalculateShippingFeeImplementation();
        this.calculateTax = new CalculateTaxesFeeImplementation();
        this.paymentConnection = new StripeConnection(this.stripeSingleton);
    
        //Pay Service
        let payOrderService = new ExceptionDecorator(
            new LoggerDecorator(
                new PayOrderAplicationService(
                    this.eventBus,
                    this.calculateShipping,
                    this.calculateTax,
                    this.paymentConnection
                ),
                new NestLogger(new Logger())
            )
        )
    }

    


    @Post('/payment')
    async realizePayment(@Body() data: PaymentEntryDto) {
        let payment: OrderPayRequestDto = {userId: 'none',...data}
        
        let response = await this.payOrderService.execute(payment);
        
        return response.getValue;
    }

    @Post('/pay')
    async realize(@Body() data: PaymentEntryDto) {
        
        try{
            return await this.stripeSingleton.stripeInstance.paymentIntents.create({
                amount: data.amount,
                currency: data.currency,
                payment_method: data.paymentMethod,
                payment_method_types: [data.paymentMethod],
                confirmation_method: 'manual',  
                confirm: true,
            });
            //return await payment;
        } catch (error) {
            console.log('Error al realizar el pago:', error);
        }
        
    }
    
}