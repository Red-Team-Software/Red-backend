import * as assert from 'assert';
import { InvalidBundleCurrencyException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-currency-exception';
import { BundlePrice } from 'src/bundle/domain/value-object/bundle-price';

describe("Bundle Currency Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bundle currency with invalid currency", () => {
    try {
        BundlePrice.create(5,'yuan')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleCurrencyException,
      `Expected InvalidBundlePriceException but got ${caughtError}`
    )
  })
})