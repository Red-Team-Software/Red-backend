import * as assert from 'assert'
import { InvalidUserImageException } from 'src/user/domain/domain-exceptions/invalid-user-image-exception'
import { UserImage } from 'src/user/domain/value-object/user-image'

describe("User Image Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User image with invalid data", () => {
    try {
      UserImage.create('images.com')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserImageException,
      `Expected InvalidUserImageException but got ${caughtError}`
    )
  })
})