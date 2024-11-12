import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
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

@ApiTags('Order')
@Controller('order')
export class OrderController {
    
    private readonly stripeSingleton: StripeSingelton ;
    private readonly hereMapsSingelton: HereMapsSingelton;
    private readonly idGen: IIdGen<string>;
    private readonly eventBus: IEventPublisher;
    private readonly calculateShipping: ICalculateShippingFee;
    private readonly calculateTax: ICalculateTaxesFee;
    private readonly paymentConnection: IPaymentService;

    //Aplication services
    private readonly payOrderService: IApplicationService<OrderPayApplicationServiceRequestDto,OrderPayResponseDto>;
    private readonly calculateTaxesShippingFee: IApplicationService<TaxesShippingFeeApplicationServiceEntryDto,CalculateTaxesShippingResponseDto>;


    constructor() {
        this.idGen = new UuidGen();
        this.stripeSingleton = StripeSingelton.getInstance();
        this.eventBus = new EventBus();
        this.hereMapsSingelton = HereMapsSingelton.getInstance(); 
        this.calculateShipping = new CalculateShippingFeeHereMaps(this.hereMapsSingelton);
        this.calculateTax = new CalculateTaxesFeeImplementation();
        this.paymentConnection = new PaymentOrderImplementation(this.stripeSingleton);
    
        //Pay Service
        this.payOrderService = new ExceptionDecorator(
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

        this.calculateTaxesShippingFee = new ExceptionDecorator(
            new LoggerDecorator(
                new CalculateTaxShippingFeeAplicationService(
                    this.eventBus,
                    this.calculateShipping,
                    this.calculateTax
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

    @Post('/pay')
    async realize(@Body() data: PaymentEntryDto) {
        
        try{

            return await this.stripeSingleton.stripeInstance.paymentIntents.create({
                amount: data.amount,
                currency: data.currency,
                payment_method: 'pm_card_threeDSecureOptional',
                payment_method_types: ['card'],
                confirmation_method: 'automatic',
                capture_method: 'automatic',
            });
            //return await payment;
        } catch (error) {
            console.log('Error al realizar el pago:', error);
        }
        
    }
    
}