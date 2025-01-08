import * as assert from 'assert';
import { EmptyPaymentMethodNameException } from 'src/payment-methods/domain/exceptions/empty-payment-method-name.exception';
import { PaymentMethodName } from 'src/payment-methods/domain/value-objects/payment-method-name';

describe("Payment Method Name Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Payment method name with invalid data", () => {
    try {
      PaymentMethodName.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof EmptyPaymentMethodNameException,
      `Expected EmptyPaymentMethodNameException but got ${caughtError}`
    )
  })
})