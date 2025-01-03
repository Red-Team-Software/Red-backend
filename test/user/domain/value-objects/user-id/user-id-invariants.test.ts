import * as assert from 'assert'
import { InvalidUserIdException } from 'src/user/domain/domain-exceptions/invalid-user-id-exception copy'
import { UserId } from 'src/user/domain/value-object/user-id'

describe("User Id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User id with invalid data", () => {
    try {
      UserId.create('id-123')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserIdException,
      `Expected InvalidUserIdException but got ${caughtError}`
    )
  })
})