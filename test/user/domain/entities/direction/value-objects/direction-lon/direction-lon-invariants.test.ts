import * as assert from 'assert';
import { InvalidUserLatitudeDirectionException } from 'src/user/domain/domain-exceptions/invalid-user-latitude-direction-exception';
import { InvalidUserLongitudeDirectionException } from 'src/user/domain/domain-exceptions/invalid-user-longitude-direction-exception';
import { DirectionLat } from 'src/user/domain/entities/directions/value-objects/direction-lat';
import { DirectionLng } from 'src/user/domain/entities/directions/value-objects/direction-lng';


describe("User direction lon Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a user direction lon with invalid latitude", () => {
    try {
    DirectionLng.create(181)
} 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserLongitudeDirectionException,
      `Expected InvalidUserLongitudeDirectionException but got ${caughtError}`
    )
  })
})