import * as assert from 'assert';
import { InvalidProductCurrencyException } from 'src/product/domain/domain-exceptions/invalid-product-currency-exception';
import { ProductPrice } from 'src/product/domain/value-object/product-price';

describe("Product Currency Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product currency with invalid currency", () => {
    try {
        ProductPrice.create(5,'yuan')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductCurrencyException,
      `Expected InvalidProductCurrencyException but got ${caughtError}`
    )
  })
})