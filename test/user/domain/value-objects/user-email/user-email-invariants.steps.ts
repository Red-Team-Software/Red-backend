import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserEmailException } from 'src/user/domain/domain-exceptions/invalid-user-email-exception';
import { UserEmail } from 'src/user/domain/value-object/user-email';

let caughtError: any;

When(`Trying to create a User email with invalid data`, async () => {
  try {
    UserEmail.create('pepe')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user email should not be created, because data is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserEmailException
  );
});