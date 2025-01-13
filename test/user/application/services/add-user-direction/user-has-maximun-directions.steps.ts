import { DirectionId } from 'src/user/domain/entities/directions/value-objects/direction-id';import { Then, When } from '@cucumber/cucumber';
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
import { InvalidUserDirectionQuantityException } from 'src/user/domain/domain-exceptions/invalid-user-direction-quantity-exception';
import { IdGeneratorMock } from 'test/common/mocks/infraestructure/id-generator.mock';
import { EventPublisherMock } from 'test/common/mocks/infraestructure/event-publisher.mock';
import { UserDirection } from 'src/user/domain/entities/directions/direction.entity';
import { DirectionFavorite } from 'src/user/domain/entities/directions/value-objects/direction-favorite';
import { DirectionLat } from 'src/user/domain/entities/directions/value-objects/direction-lat';
import { DirectionLng } from 'src/user/domain/entities/directions/value-objects/direction-lng';
import { DirectionName } from 'src/user/domain/entities/directions/value-objects/direction-name';

let idGen = new IdGeneratorMock()

const users: User[] = [
  User.initializeAggregate(
    UserId.create('e09771db-2657-45fb-ad39-ae6604422919'),
    UserName.create('John Doe'),
    UserPhone.create('04122345678'),
    UserRole.create('CLIENT'),
    [
      UserDirection.create(
        DirectionId.create('e09771db-2657-45fb-ad39-ae6604422918'),
        DirectionFavorite.create(true),
        DirectionLat.create(10.123456),
        DirectionLng.create(-66.123456),
        DirectionName.create('Home')
    ),
    UserDirection.create(
        DirectionId.create('e09771db-2657-45fb-ad39-ae6604422917'),
        DirectionFavorite.create(false),
        DirectionLat.create(10.123456),
        DirectionLng.create(-66.789456),
        DirectionName.create('Work')
    ),
    UserDirection.create(
        DirectionId.create('e09771db-2657-45fb-ad39-ae6604422916'),
        DirectionFavorite.create(false),
        DirectionLat.create(10.123456),
        DirectionLng.create(-66.14564),
        DirectionName.create('School')
    ),
    UserDirection.create(
        DirectionId.create('e09771db-2657-45fb-ad39-ae6604422915'),
        DirectionFavorite.create(false),
        DirectionLat.create(10.123456),
        DirectionLng.create(-66.12465),
        DirectionName.create('Gym')
    ),
    UserDirection.create(
        DirectionId.create('e09771db-2657-45fb-ad39-ae6604422914'),
        DirectionFavorite.create(false),
        DirectionLat.create(10.123456),
        DirectionLng.create(-78.123456),
        DirectionName.create('Park')
    ),
    UserDirection.create(
        DirectionId.create('e09771db-2657-45fb-ad39-ae6604422913'),
        DirectionFavorite.create(false),
        DirectionLat.create(10.123456),
        DirectionLng.create(-45.123456),
        DirectionName.create('Restaurant')
    )
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
  new EventPublisherMock(),
  new IdGeneratorMock()
)

let caughtError:any

When('Trying to create a User with one more direction, when he already has the 6 directions', async () => {
  try {
    await service.execute({
      userId: 'e09771db-2657-45fb-ad39-ae6604422919',
      directions:{
          name: 'Supermarket',
          favorite: true,
          lat: 24.123456,
          long: 10.123456,
          direction:''
        }
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