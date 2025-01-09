import * as assert from 'assert';
import { InvalidProductIdException } from 'src/product/domain/domain-exceptions/invalid-product-id-exception';
import { PaymentMethod } from 'src/order/domain/entities/payment/value-object/payment-method';
import { OrderPayment } from 'src/order/domain/entities/payment/order-payment-entity';
import { PaymentMethodAgregate } from 'src/payment-methods/domain/agregate/payment-method-agregate';
import { PaymentMethodId } from 'src/payment-methods/domain/value-objects/payment-method-id';
import { PaymentMethodName } from 'src/payment-methods/domain/value-objects/payment-method-name';
import { PaymentMethodState } from 'src/payment-methods/domain/value-objects/payment-method-state';
import { PaymentMethodImage } from 'src/payment-methods/domain/value-objects/payment-method-image';
import { InvalidPaymentMethodIdException } from 'src/payment-methods/domain/exceptions/invalid-payment-method-id-exception';


describe("Payment Method Aggregate Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a payment method with invalid PaymentMethodId", () => {
    try {
      PaymentMethodAgregate.initializeAgregate(
        PaymentMethodId.create('12345'),
        PaymentMethodName.create('stripe'),
        PaymentMethodState.create('active'),
        PaymentMethodImage.create('image-1')
      )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPaymentMethodIdException,
      `Expected InvalidPaymentMethodIdException but got ${caughtError}`
    )
  })
})