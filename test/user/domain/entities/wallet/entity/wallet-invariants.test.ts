import * as assert from 'assert';
import { InvalidWalletIdException } from 'src/user/domain/entities/wallet/domain-exceptions/invalid-wallet-id-exception';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';
import { Wallet } from 'src/user/domain/entities/wallet/wallet.entity';


describe("User Wallet Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a wallet with invalid walletId", () => {
    try {
      Wallet.create(
        WalletId.create('id-123'),
        Ballance.create(5,'usd')
      )
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