import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeSingelton } from 'src/payments/infraestructure/stripe-singelton';

import { IIdGen } from 'src/common/application/id-gen/id-gen.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { ExceptionDecorator } from 'src/common/application/aspects/exeption-decorator/exception-decorator';
import { PayOrderAplicationService } from 'src/Order/application/service/pay-order-application.service';
import { EventBus } from 'src/common/infraestructure/events/publishers/event-bus';
import { IEventPublisher } from 'src/common/application/events/event-publisher/event-publisher.abstract';
import { IApplicationService } from 'src/common/application/services';
import { OrderPayRequestDto } from 'src/Order/application/dto/request/order-pay-request-dto';
import { OrderPayResponseDto } from 'src/Order/application/dto/response/order-pay-response-dto';
import { LoggerDecorator } from 'src/common/application/aspects/logger-decorator/logger-decorator';
import { ICalculateShippingFee } from 'src/Order/domain/domain-services/calculate-shippping-fee.interfafe';
import { ICalculateTaxesFee } from 'src/Order/domain/domain-services/calculate-taxes-fee.interface';
import { IPaymentService } from 'src/Order/domain/domain-services/payment-interface';
import { CalculateShippingFeeImplementation } from '../domain-service/calculate-shipping-fee-implementation';
import { CalculateTaxesFeeImplementation } from '../domain-service/calculate-tax-fee-implementation';
import { StripeConnection } from '../domain-service/stripe_adapter';
import { NestLogger } from 'src/common/infraestructure/logger/nest-logger';
import { CalculateShippingFeeHereMaps } from '../domain-service/calculate-shipping-here-maps';
import { HereMapsSingelton } from '../../../payments/infraestructure/here-maps-singleton';
import { PaymentOrderImplementation } from '../domain-service/payment-order-implementation';
import { ConfirmPaymentDto, PaymentEntryDto } from '../dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  private readonly stripeSingleton: StripeSingelton;
  private readonly hereMapsSingelton: HereMapsSingelton;
  private readonly idGen: IIdGen<string>;
  private readonly eventBus: IEventPublisher;
  private readonly calculateShipping: ICalculateShippingFee;
  private readonly calculateTax: ICalculateTaxesFee;
  private readonly paymentConnection: IPaymentService;

  //Aplication services
  private readonly payOrderService: IApplicationService<
    OrderPayRequestDto,
    OrderPayResponseDto
  >;

  constructor() {
    this.idGen = new UuidGen();
    this.stripeSingleton = StripeSingelton.getInstance();
    this.eventBus = new EventBus();
    this.hereMapsSingelton = HereMapsSingelton.getInstance();
    this.calculateShipping = new CalculateShippingFeeHereMaps(
      this.hereMapsSingelton,
    );
    this.calculateTax = new CalculateTaxesFeeImplementation();
    this.paymentConnection = new PaymentOrderImplementation(
      this.stripeSingleton,
    );

    //Pay Service
    this.payOrderService = new ExceptionDecorator(
      new LoggerDecorator(
        new PayOrderAplicationService(
          this.eventBus,
          this.calculateShipping,
          this.calculateTax,
          this.paymentConnection,
        ),
        new NestLogger(new Logger()),
      ),
    );
  }

  @Post('/payment')
  async realizePayment(@Body() data: PaymentEntryDto) {
    let payment: OrderPayRequestDto = {
      userId: 'none',
      ...data,
    };

    let response = await this.payOrderService.execute(payment);

    return response.getValue.paymentState;
  }

  @Post('/pay')
  async realize(@Body() data: PaymentEntryDto) {
    try {
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

  @Post('/create-payment')
  async createPaymentIntent(@Body() data: PaymentEntryDto) {
    try {
      const paymentIntent =
        await this.stripeSingleton.stripeInstance.paymentIntents.create({
          amount: data.amount,
          currency: data.currency,
          payment_method_types: ['card'],
          confirmation_method: 'manual',
        });
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  }

  @Post('/confirm-payment')
  async confirmPaymentIntent(@Body() body: ConfirmPaymentDto) {
    try {
      const confirmedPaymentIntent =
        await this.stripeSingleton.stripeInstance.paymentIntents.confirm(
          body.paymentIntentId,
          {
            payment_method: body.paymentMethod,
          },
        );
      console.log('pago confirmado', confirmedPaymentIntent);
      return confirmedPaymentIntent;
    } catch (error) {
      console.error('Error confirming payment intent:', error);
    }
  }
}
