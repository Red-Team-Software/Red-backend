import * as assert from 'assert';
import { InvalidBallanceCurrencyException } from 'src/user/domain/entities/wallet/domain-exceptions/invalid-ballance-currency-exception';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';


describe("User Balance amount Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User balance with invalid amount", () => {
    try {
    Ballance.create(0,'yuan')
} 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBallanceCurrencyException,
      `Expected InvalidBallanceCurrencyException but got ${caughtError}`
    )
  })
})