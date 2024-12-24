import * as assert from 'assert';
import { InvalidProductImageException } from 'src/product/domain/domain-exceptions/invalid-product-image-exception';
import { ProductImage } from 'src/product/domain/value-object/product-image';

describe("Product Image Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product image with invalid image", () => {
    try {
        ProductImage.create(`test`)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductImageException,
      `Expected InvalidProductImageException but got ${caughtError}`
    )
  })
})