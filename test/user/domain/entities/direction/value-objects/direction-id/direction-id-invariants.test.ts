import * as assert from 'assert';
import { InvalidDirectionIdException } from 'src/user/domain/entities/directions/domain-exceptions/invalid-direction-id-exception';
import { DirectionId } from 'src/user/domain/entities/directions/value-objects/Direction-id';


describe("User direction id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a user direction id with invalid id", () => {
    try {
    DirectionId.create('id-123')
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