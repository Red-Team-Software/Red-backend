import * as assert from 'assert';
import { InvalidProductIdException } from 'src/product/domain/domain-exceptions/invalid-product-id-exception';
import { ProductID } from 'src/product/domain/value-object/product-id';

describe("Product Id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product id with invalid id", () => {
    try {
        ProductID.create(`id-123`)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductIdException,
      `Expected InvalidProductIdException but got ${caughtError}`
    )
  })
})