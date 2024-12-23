import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { InvalidUserImageException } from 'src/user/domain/domain-exceptions/invalid-user-image-exception';
import { UserImage } from 'src/user/domain/value-object/user-image';

let caughtError: any;

When(`Trying to create a User image with invalid data`, async () => {
  try {
    UserImage.create('pepe.ve')
  } catch (error) {
    caughtError = error;
  }
});

Then(`The user image should not be created, because data is invalid`, async () => {
  assert.ok(
    caughtError instanceof InvalidUserImageException
  );
});