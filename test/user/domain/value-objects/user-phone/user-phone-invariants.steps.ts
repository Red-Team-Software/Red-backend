import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserPhoneException } from 'src/user/domain/domain-exceptions/invalid-user-phone-exception';
import { UserPhone } from 'src/user/domain/value-object/user-phone';

let caughtError: any;

When(`Trying to create a User phone with invalid data`, async () => {
  try {
    UserPhone.create('+5841212345678910')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user phone should not be created, because data is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserPhoneException
  );
});