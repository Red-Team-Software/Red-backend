import * as assert from 'assert'
import { InvalidUserEmailException } from 'src/user/domain/domain-exceptions/invalid-user-email-exception'
import { UserEmail } from 'src/user/domain/value-object/user-email'


describe("User Email Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User email with invalid data", () => {
    try {
      UserEmail.create('pepe.com')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserEmailException,
      `Expected InvalidUserEmailException but got ${caughtError}`
    )
  })
})