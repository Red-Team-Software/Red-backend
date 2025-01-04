import * as assert from 'assert';
import { InvalidProductNameException } from 'src/product/domain/domain-exceptions/invalid-product-name-exception';
import { ProductName } from 'src/product/domain/value-object/product-name';

describe("Product Name Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product name with invalid name", () => {
    try {
        ProductName.create(`test`)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductNameException,
      `Expected InvalidProductNameException but got ${caughtError}`
    )
  })
})