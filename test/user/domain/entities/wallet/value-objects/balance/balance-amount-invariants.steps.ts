import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidBallanceAmountException } from 'src/user/domain/entities/wallet/domain-exceptions/invalid-ballance-amount-exception';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';

let caughtError: any;

When(`Trying to create a User balance with invalid amount`, async () => {
  try {
    Ballance.create(-5,'usd')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user balance should not be created, because amount is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidBallanceAmountException
  );
});