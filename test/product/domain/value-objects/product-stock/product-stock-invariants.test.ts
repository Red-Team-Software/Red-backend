import * as assert from 'assert';
import { InvalidProductStockException } from 'src/product/domain/domain-exceptions/invalid-product-stock-exception';
import { ProductStock } from 'src/product/domain/value-object/product-stock';

describe("Product Stock Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product stock with invalid stock", () => {
    try {
        ProductStock.create(-5)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductStockException,
      `Expected InvalidProductStockException but got ${caughtError}`
    )
  })
})