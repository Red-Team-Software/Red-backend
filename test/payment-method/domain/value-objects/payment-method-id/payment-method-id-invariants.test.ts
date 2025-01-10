import * as assert from 'assert'
import { InvalidPaymentMethodIdException } from 'src/payment-methods/domain/exceptions/invalid-payment-method-id-exception'
import { PaymentMethodId } from 'src/payment-methods/domain/value-objects/payment-method-id'

describe("Payment Method Id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Payment method id with invalid data", () => {
    try {
      PaymentMethodId.create('id-123')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPaymentMethodIdException,
      `Expected InvalidPaymentMethodIdException but got ${caughtError}`
    )
  })
})