import * as assert from 'assert';
import { InvalidBallanceAmountException } from 'src/user/domain/entities/wallet/domain-exceptions/invalid-ballance-amount-exception';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';


describe("User Balance amount Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User balance with invalid amount", () => {
    try {
    Ballance.create(-5,'usd')
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBallanceAmountException,
      `Expected InvalidBallanceAmountException but got ${caughtError}`
    )
  })
})