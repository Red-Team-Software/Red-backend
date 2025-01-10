import * as assert from 'assert'
import { InvalidCourierImageException } from 'src/courier/domain/exceptions/invalid-courier-image-exception'
import { CourierImage } from 'src/courier/domain/value-objects/courier-image'

describe("Courier Image Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Courier image with invalid data", () => {
    try {
      CourierImage.create('images.com')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidCourierImageException,
      `Expected InvalidCourierImageException but got ${caughtError}`
    )
  })
})