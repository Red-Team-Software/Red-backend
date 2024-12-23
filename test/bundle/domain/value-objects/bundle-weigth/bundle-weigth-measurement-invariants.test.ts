import * as assert from 'assert';
import { InvalidBundleMeasurementException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-measurement-exception';
import { BundleWeigth } from 'src/bundle/domain/value-object/bundle-weigth';

describe("Bundle Weigth Measurement Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bundle weigth with invalid measurement", () => {
    try {
        BundleWeigth.create(5,'pounds')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleMeasurementException,
      `Expected InvalidBundleMeasurementException but got ${caughtError}`
    )
  })
})