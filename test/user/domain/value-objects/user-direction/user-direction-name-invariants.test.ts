import * as assert from 'assert';
import { InvalidUserDirectionNameException } from 'src/user/domain/domain-exceptions/invalid-user-direction-name-exception';
import { UserDirection } from 'src/user/domain/value-object/user-direction';

describe("User Direction Name Invariants", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User direction with invalid name", () => {
    try {      
      UserDirection.create('', false, 90, 30)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserDirectionNameException,
      `Expected InvalidUserDirectionNameException but got ${caughtError}`
    )
  })
})