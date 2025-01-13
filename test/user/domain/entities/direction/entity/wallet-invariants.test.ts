import * as assert from 'assert';
import { UserDirection } from 'src/user/domain/entities/directions/direction.entity';
import { InvalidDirectionIdException } from 'src/user/domain/entities/directions/domain-exceptions/invalid-direction-id-exception';
import { DirectionFavorite } from 'src/user/domain/entities/directions/value-objects/direction-favorite';
import { DirectionId } from 'src/user/domain/entities/directions/value-objects/direction-id';import { DirectionLat } from 'src/user/domain/entities/directions/value-objects/direction-lat';
import { DirectionLng } from 'src/user/domain/entities/directions/value-objects/direction-lng';
import { DirectionName } from 'src/user/domain/entities/directions/value-objects/direction-name';


describe("User Directions Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a direction with invalid directionId", () => {
    try {
      UserDirection.create(
        DirectionId.create('id-123'),
        DirectionFavorite.create(true),
        DirectionLat.create(45),
        DirectionLng.create(4),
        DirectionName.create('test')
      )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidDirectionIdException,
      `Expected InvalidDirectionIdException but got ${caughtError}`
    )
  })
})