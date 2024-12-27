import * as assert from 'assert';
import { InvalidPaymentMethodStateException } from 'src/payment-methods/domain/exceptions/invalid-payment-method-state-exception';
import { PaymentMethodState } from 'src/payment-methods/domain/value-objects/payment-method-state';

describe("Payment Method State Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Payment method state with invalid data", () => {
    try {
      PaymentMethodState.create('hola')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPaymentMethodStateException,
      `Expected InvalidPaymentMethodStateException but got ${caughtError}`
    )
  })
})