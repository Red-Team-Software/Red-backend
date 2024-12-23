import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserNameException } from 'src/user/domain/domain-exceptions/invalid-user-name-exception';
import { UserName } from 'src/user/domain/value-object/user-name';

let caughtError: any;

When(`Trying to create a User name with invalid data`, async () => {
  try {
    UserName.create('')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user name should not be created, because data is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserNameException
  );
});