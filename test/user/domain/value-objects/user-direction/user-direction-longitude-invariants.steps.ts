import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserLongitudeDirectionException } from 'src/user/domain/domain-exceptions/invalid-user-longitude-direction-exception';
import { UserDirection } from 'src/user/domain/value-object/user-direction';

let caughtError: any;

When(`Trying to create a User direction's with invalid longitude`, async () => {
  try {
    UserDirection.create('test', false, 90, 181);
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user direction's should not be created, because longitude is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserLongitudeDirectionException
  );
});