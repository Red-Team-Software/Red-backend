import * as assert from 'assert';
import { InvalidUserNameException } from 'src/user/domain/domain-exceptions/invalid-user-name-exception';
import { UserName } from 'src/user/domain/value-object/user-name';

describe("User Name Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User name with invalid data", () => {
    try {
      UserName.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserNameException,
      `Expected InvalidUserNameException but got ${caughtError}`
    )
  })
})