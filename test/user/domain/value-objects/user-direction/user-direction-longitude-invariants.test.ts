import * as assert from 'assert';
import { InvalidUserLongitudeDirectionException } from 'src/user/domain/domain-exceptions/invalid-user-longitude-direction-exception';
import { UserDirection } from 'src/user/domain/value-object/user-direction';


describe("User Direction Longitude Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User direction with invalid Longitude", () => {
    try {      
      UserDirection.create('test', false, 90, 181)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserLongitudeDirectionException,
      `Expected InvalidUserLongitudeDirectionException but got ${caughtError}`
    )
  })
})