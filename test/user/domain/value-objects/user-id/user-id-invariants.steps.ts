import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserIdException } from 'src/user/domain/domain-exceptions/invalid-user-id-exception copy';
import { UserId } from 'src/user/domain/value-object/user-id';

let caughtError: any;

When(`Trying to create a User id with invalid data`, async () => {
  try {
    UserId.create('id-123')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user id should not be created, because data is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserIdException
  );
});