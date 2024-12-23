import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserDirectionNameException } from 'src/user/domain/domain-exceptions/invalid-user-direction-name-exception';
import { UserDirection } from 'src/user/domain/value-object/user-direction';

let caughtError: any;

When(`Trying to create a User direction's with invalid name`, async () => {
  try {
    UserDirection.create('', false, 45, 30);
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user direction's should not be created, because name is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserDirectionNameException
  );
});