import * as assert from 'assert';
import { InvalidBundleImageException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-image-exception';
import { BundleImage } from 'src/bundle/domain/value-object/bundle-image';

describe("Bundle image Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Bundle image with invalid image", () => {
    try {
        BundleImage.create('test')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleImageException,
      `Expected InvalidBundleImageException but got ${caughtError}`
    )
  })
})