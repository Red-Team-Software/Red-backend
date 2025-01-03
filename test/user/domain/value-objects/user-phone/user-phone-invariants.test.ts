import * as assert from 'assert'
import { InvalidUserPhoneException } from 'src/user/domain/domain-exceptions/invalid-user-phone-exception'
import { UserPhone } from 'src/user/domain/value-object/user-phone'

describe("User Phone Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User phone with invalid data", () => {
    try {
      UserPhone.create('+5841212345678910')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserPhoneException,
      `Expected InvalidUserPhoneException but got ${caughtError}`
    )
  })
})