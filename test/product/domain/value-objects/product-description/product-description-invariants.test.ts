import * as assert from 'assert';
import { InvalidProductDescriptionException } from 'src/product/domain/domain-exceptions/invalid-product-description-exception';
import { ProductDescription } from 'src/product/domain/value-object/product-description';

describe("Product description Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product description with invalid descripption", () => {
    try {
        ProductDescription.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductDescriptionException,
      `Expected InvalidProductDescriptionException but got ${caughtError}`
    )
  })
})