import * as assert from 'assert';
import { InvalidBundleDescriptionException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-description-exception';
import { BundleDescription } from 'src/bundle/domain/value-object/bundle-description';

describe("Bundle Description Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bundle description date with invalid description", () => {
    try {
        BundleDescription.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleDescriptionException,
      `Expected InvalidProductDescriptionException but got ${caughtError}`
    )
  })
})