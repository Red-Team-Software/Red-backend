import * as assert from 'assert';
import { InvalidBundleIdException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-id-exception';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';

describe("Bundle id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bundle id with invalid id", () => {
    try {
        BundleId.create('id-132')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleIdException,
      `Expected InvalidBundleIdException but got ${caughtError}`
    )
  })
})