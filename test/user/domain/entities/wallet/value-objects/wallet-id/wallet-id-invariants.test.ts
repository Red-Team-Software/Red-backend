import * as assert from 'assert';
import { InvalidWalletIdException } from 'src/user/domain/entities/wallet/domain-exceptions/invalid-wallet-id-exception';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';


describe("User Balance id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a User balance with invalid id", () => {
    try {
    WalletId.create('id-123')
} 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidWalletIdException,
      `Expected InvalidWalletIdException but got ${caughtError}`
    )
  })
})