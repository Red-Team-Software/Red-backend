import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidBallanceCurrencyException } from 'src/user/domain/entities/wallet/domain-exceptions/invalid-ballance-currency-exception';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';

let caughtError: any;

When(`Trying to create a User balance with invalid currency`, async () => {
  try {
    Ballance.create(0,'yuan')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user balance should not be created, because currency is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidBallanceCurrencyException
  );
});