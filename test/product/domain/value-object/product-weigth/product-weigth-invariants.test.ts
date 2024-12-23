import * as assert from 'assert';
import { InvalidProductStockException } from 'src/product/domain/domain-exceptions/invalid-product-stock-exception';
import { InvalidProductWeigthException } from 'src/product/domain/domain-exceptions/invalid-product-weigth-exception';
import { ProductStock } from 'src/product/domain/value-object/product-stock';
import { ProductWeigth } from 'src/product/domain/value-object/product-weigth';

describe("Product Weigth Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product weigth with invalid wigth", () => {
    try {
        ProductWeigth.create(-5,'kg')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductWeigthException,
      `Expected InvalidProductWeigthException but got ${caughtError}`
    )
  })
})