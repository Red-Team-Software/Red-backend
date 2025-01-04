import * as assert from 'assert';
import { User } from 'src/user/domain/aggregate/user.aggregate';
import { InvalidUserIdException } from 'src/user/domain/domain-exceptions/invalid-user-id-exception copy';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';
import { Wallet } from 'src/user/domain/entities/wallet/wallet.entity';
import { UserDirection } from 'src/user/domain/value-object/user-direction';
import { UserId } from 'src/user/domain/value-object/user-id';
import { UserName } from 'src/user/domain/value-object/user-name';
import { UserPhone } from 'src/user/domain/value-object/user-phone';
import { UserRole } from 'src/user/domain/value-object/user-role';


describe("User Aggregate Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a user with invalid UserId", () => {
    try {
          User.initializeAggregate(
            UserId.create('user-123'),
            UserName.create('John Doe'),
            UserPhone.create('04122345678'),
            UserRole.create('CLIENT'),
            [
              UserDirection.create('Home',true,10.123456,-66.123456),
              UserDirection.create('Work',false,10.123456,-66.789456),
              UserDirection.create('School',false,10.123456,-66.14564),
              UserDirection.create('Gym',false,10.123456,-66.12465),
              UserDirection.create('Park',false,10.123456,-78.123456),
              UserDirection.create('Restaurant',false,10.123456,-45.123456)
            ],
            Wallet.create(
              WalletId.create('fd5235de-9533-4660-8b00-67448de3b767'),
              Ballance.create(45,'usd')
            )
          )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserIdException,
      `Expected InvalidUserIdException but got ${caughtError}`
    )
  })
})