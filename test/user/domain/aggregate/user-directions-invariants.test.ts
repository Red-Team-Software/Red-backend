import * as assert from 'assert';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { CuponId } from 'src/cupon/domain/value-object/cupon-id';
import { User } from 'src/user/domain/aggregate/user.aggregate';
import { InvalidUserDirectionQuantityException } from 'src/user/domain/domain-exceptions/invalid-user-direction-quantity-exception';
import { UserCoupon } from 'src/user/domain/entities/coupon/user-coupon.entity';
import { CuponState } from 'src/user/domain/entities/coupon/value-objects/cupon-state';
import { UserDirection } from 'src/user/domain/entities/directions/direction.entity';
import { DirectionFavorite } from 'src/user/domain/entities/directions/value-objects/direction-favorite';
import { DirectionId } from 'src/user/domain/entities/directions/value-objects/direction-id';import { DirectionLat } from 'src/user/domain/entities/directions/value-objects/direction-lat';
import { DirectionLng } from 'src/user/domain/entities/directions/value-objects/direction-lng';
import { DirectionName } from 'src/user/domain/entities/directions/value-objects/direction-name';
import { Ballance } from 'src/user/domain/entities/wallet/value-objects/balance';
import { WalletId } from 'src/user/domain/entities/wallet/value-objects/wallet-id';
import { Wallet } from 'src/user/domain/entities/wallet/wallet.entity';
import { UserId } from 'src/user/domain/value-object/user-id';
import { UserName } from 'src/user/domain/value-object/user-name';
import { UserPhone } from 'src/user/domain/value-object/user-phone';
import { UserRole } from 'src/user/domain/value-object/user-role';
import { IdGeneratorMock } from 'test/common/mocks/infraestructure/id-generator.mock';


describe("User Aggregate Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a user with more than 6 directions", async () => {
    try {
          const user=User.initializeAggregate(
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
            ),
              [UserCoupon.create(
                CuponId.create('fd5235de-9533-4660-8b00-67448de3b767'),
                CuponState.create('used')
              )],
          )
          user.addDirection(
            UserDirection.create(
              DirectionId.create(await new IdGeneratorMock().genId()),
              DirectionFavorite.create(true),
              DirectionLat.create(10.123456),
              DirectionLng.create(-45.123456),
              DirectionName.create('Collegue')
            )
          )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidUserDirectionQuantityException,
      `Expected InvalidUserDirectionQuantityException but got ${caughtError}`
    )
  })
})