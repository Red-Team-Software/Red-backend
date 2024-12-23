import * as assert from 'assert';
import { InvalidProductPriceException } from 'src/product/domain/domain-exceptions/invalid-product-price-exception';
import { ProductPrice } from 'src/product/domain/value-object/product-price';

describe("Product Price Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product price with invalid price", () => {
    try {
        ProductPrice.create(-5, 'usd')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductPriceException,
      `Expected InvalidProductPriceException but got ${caughtError}`
    )
  })
})