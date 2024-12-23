import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { Optional } from 'src/common/utils/optional/Optional';
import { User } from 'src/user/domain/aggregate/user.aggregate';
import { InvalidUserException } from 'src/user/domain/domain-exceptions/invalid-user-exception';
import { InvalidUserIdException } from 'src/user/domain/domain-exceptions/invalid-user-id-exception copy';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';
import { Wallet } from 'src/user/domain/entities/wallet/wallet.entity';
import { UserId } from 'src/user/domain/value-object/user-id';
import { UserName } from 'src/user/domain/value-object/user-name';
import { UserPhone } from 'src/user/domain/value-object/user-phone';
import { UserRole } from 'src/user/domain/value-object/user-role';

let caughtError

When('Trying to create a User with invalid data', async () => {
  try {
    User.RegisterUser(
      UserId.create('id-123'),
      UserName.create('test'),
      UserPhone.create('04128489865'),
      UserRole.create('client'),
      [],
      Wallet.create(
        WalletId.create('id-123'),
        Ballance.create(45,'usd')
      )
    )
  } catch (error) {
    caughtError= error
  }
});

Then('The user should not be created', async () => {

  console.log(assert)
  assert.ok(
      caughtError.getValue instanceof InvalidUserException 
  );
});