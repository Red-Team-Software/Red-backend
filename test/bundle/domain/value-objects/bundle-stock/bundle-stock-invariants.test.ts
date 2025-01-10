import * as assert from 'assert';
import { InvalidBundleStockException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-stock-exception';
import { BundleStock } from 'src/bundle/domain/value-object/bundle-stock';

describe("Bundle stock Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bundle stock with invalid stock",() => {
    try {
        BundleStock.create(-1)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleStockException,
      `Expected InvalidBundleStockException but got ${caughtError}`
    )
  })
})