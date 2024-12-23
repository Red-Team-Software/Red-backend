import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidWalletIdException } from 'src/user/domain/entities/wallet/domain-exceptions/invalid-wallet-id-exception';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';
import { Wallet } from 'src/user/domain/entities/wallet/wallet.entity';

let caughtError

When('Trying to create a wallet with invalid data', async () => {
  try {
    Wallet.create(
      WalletId.create('id-123'),
      Ballance.create(45,'usd')
    )
    
  } catch (error) {
    caughtError= error
  }
});

Then('The wallet should not be created', async () => {
  assert.ok(
      caughtError instanceof InvalidWalletIdException 
  );
});