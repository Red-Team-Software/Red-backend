import * as assert from 'assert'
import { InvalidUserLatitudeDirectionException } from 'src/user/domain/domain-exceptions/invalid-user-latitude-direction-exception'
import { UserDirection } from 'src/user/domain/value-object/user-direction'


describe("User Direction Latitude Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User direction with invalid latitude", () => {
    try {
      UserDirection.create('test', false, 91, 30)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserLatitudeDirectionException,
      `Expected InvalidUserLatitudeDirectionException but got ${caughtError}`
    )
  })
})