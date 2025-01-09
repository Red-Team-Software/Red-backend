import * as assert from 'assert'
import { InvalidPaymentMethodImageException } from 'src/payment-methods/domain/exceptions/invalid-payment-method-image-exception'
import { PaymentMethodImage } from 'src/payment-methods/domain/value-objects/payment-method-image'

describe("Payment Method Image Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Payment method image with invalid data", () => {
    try {
      PaymentMethodImage.create('images.com')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPaymentMethodImageException,
      `Expected InvalidPaymentMethodImageException but got ${caughtError}`
    )
  })
})