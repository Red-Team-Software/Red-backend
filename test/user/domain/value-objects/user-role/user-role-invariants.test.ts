import * as assert from 'assert';
import { InvalidUserRoleException } from 'src/user/domain/domain-exceptions/invalid-user-role-exception';
import { UserRole } from 'src/user/domain/value-object/user-role';

describe("User Role Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Role phone with invalid role", () => {
    try {
      UserRole.create('admin')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserRoleException,
      `Expected InvalidUserRoleException but got ${caughtError}`
    )
  })
})