import * as assert from 'assert';
import { InvalidProductMeasurementException } from 'src/product/domain/domain-exceptions/invalid-product-measurement-exception';
import { ProductWeigth } from 'src/product/domain/value-object/product-weigth';

describe("Product Weigth Measurement Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product weigth with invalid measurement", () => {
    try {
        ProductWeigth.create(5,'pounds')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductMeasurementException,
      `Expected InvalidProductMeasurementException but got ${caughtError}`
    )
  })
})