import * as assert from 'assert';
import { InvalidUserDirectionNameException } from 'src/user/domain/domain-exceptions/invalid-user-direction-name-exception';
import { DirectionName } from 'src/user/domain/entities/directions/value-objects/direction-name';

describe("User Direction Name Invariants", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User direction with invalid name", () => {
    try {      
      DirectionName.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserDirectionNameException,
      `Expected InvalidUserDirectionNameException but got ${caughtError}`
    )
  })
})