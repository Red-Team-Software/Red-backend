import * as assert from 'assert';
import { InvalidUserLatitudeDirectionException } from 'src/user/domain/domain-exceptions/invalid-user-latitude-direction-exception';
import { DirectionLat } from 'src/user/domain/entities/directions/value-objects/direction-lat';


describe("User direction lat Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a user direction lat with invalid latitude", () => {
    try {
    DirectionLat.create(100)
} 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserLatitudeDirectionException,
      `Expected InvalidUserLatitudeDirectionException but got ${caughtError}`
    )
  })
})