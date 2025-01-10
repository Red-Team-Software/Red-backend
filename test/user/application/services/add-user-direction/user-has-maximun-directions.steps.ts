import { Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { UserCommandRepositoryMock } from '../../../infraestructure/mocks/repositories/user-command-repository.mock';
import { User } from 'src/user/domain/aggregate/user.aggregate';
import { UserId } from 'src/user/domain/value-object/user-id';
import { UserQueryRepositoryMock } from 'test/user/infraestructure/mocks/repositories/user-query-repository.mock';
import { UserName } from 'src/user/domain/value-object/user-name';
import { UserPhone } from 'src/user/domain/value-object/user-phone';
import { UserRole } from 'src/user/domain/value-object/user-role';
import { Wallet } from 'src/user/domain/entities/wallet/wallet.entity';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';
import { AddUserDirectionApplicationService } from 'src/user/application/services/command/add-user-direction-application.service';
import { UserDirection } from 'src/user/domain/value-object/user-direction';
import { InvalidUserDirectionQuantityException } from 'src/user/domain/domain-exceptions/invalid-user-direction-quantity-exception';
import { IdGeneratorMock } from 'test/common/mocks/infraestructure/id-generator.mock';
import { EventPublisherMock } from 'test/common/mocks/infraestructure/event-publisher.mock';

let idGen = new IdGeneratorMock()

const users: User[] = [
  User.initializeAggregate(
    UserId.create('e09771db-2657-45fb-ad39-ae6604422919'),
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
]

let service= new AddUserDirectionApplicationService(
  new UserCommandRepositoryMock(users),
  new UserQueryRepositoryMock(users,idGen),
  new EventPublisherMock()
)

let caughtError:any

When('Trying to create a User with one more direction, when he already has the 6 directions', async () => {
  try {
    await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      directions: [
        {
          name: 'Supermarket',
          favorite: true,
          lat: 24.123456,
          lng: 10.123456
        },
        {
          name: 'Pharmacy',
          favorite: false,
          lat: 20.123456,
          lng: 2.123456
        }
      ] 
    }
  )
  } catch (error) {
    caughtError= error
  }
})

Then('The user should not be created because it already has maximun directions', async () => {
  assert.ok(
      caughtError instanceof InvalidUserDirectionQuantityException,
      `Expected InvalidUserDirectionQuantityException but got ${caughtError}`
  )
})