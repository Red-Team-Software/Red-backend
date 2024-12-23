import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidWalletIdException } from 'src/user/domain/entities/wallet/domain-exceptions/invalid-wallet-id-exception';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';

let caughtError: any;

When(`Trying to create a Wallet id with invalid data`, async () => {
  try {
    WalletId.create('id-123')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The Wallet id should not be created, because data is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidWalletIdException
  );
});