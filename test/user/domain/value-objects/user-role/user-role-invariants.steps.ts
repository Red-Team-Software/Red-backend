import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserRoleException } from 'src/user/domain/domain-exceptions/invalid-user-role-exception';
import { UserRole } from 'src/user/domain/value-object/user-role';

let caughtError: any;

When(`Trying to create a User role with invalid data`, async () => {
  try {
    UserRole.create('admin')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user role should not be created, because data is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserRoleException
  );
});