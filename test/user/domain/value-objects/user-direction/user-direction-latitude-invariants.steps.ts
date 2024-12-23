import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserLatitudeDirectionException } from 'src/user/domain/domain-exceptions/invalid-user-latitude-direction-exception';
import { UserDirection } from 'src/user/domain/value-object/user-direction';

let caughtError: any;

When(`Trying to create a User direction's with invalid latitude`, async () => {
  try {
    UserDirection.create('test', false, 91, 30);
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user direction's should not be created, because latitude is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserLatitudeDirectionException
  );
});