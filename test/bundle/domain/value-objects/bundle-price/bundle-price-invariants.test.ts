import * as assert from 'assert';
import { InvalidBundlePriceException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-price-exception';
import { BundlePrice } from 'src/bundle/domain/value-object/bundle-price';

describe("Bundle Price Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bundle price with invalid price", () => {
    try {
        BundlePrice.create(-5, 'usd')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundlePriceException,
      `Expected InvalidBundlePriceException but got ${caughtError}`
    )
  })
})