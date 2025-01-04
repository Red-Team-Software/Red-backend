import * as assert from 'assert';
import { InvalidBundleWeigthException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-weigth-exception';
import { BundleWeigth } from 'src/bundle/domain/value-object/bundle-weigth';

describe("Bundle Weigth Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bunlde weigth with invalid wigth", () => {
    try {
        BundleWeigth.create(-5,'kg')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleWeigthException,
      `Expected InvalidBundleWeigthException but got ${caughtError}`
    )
  })
})