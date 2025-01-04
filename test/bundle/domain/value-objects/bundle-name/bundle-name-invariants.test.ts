import * as assert from 'assert';
import { InvalidBundleNameException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-name-exception';
import { BundleName } from 'src/bundle/domain/value-object/bundle-name';

describe("Bundle name Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bundle name with invalid name",() => {
    try {
        BundleName.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleNameException,
      `Expected InvalidBundleNameException but got ${caughtError}`
    )
  })
})