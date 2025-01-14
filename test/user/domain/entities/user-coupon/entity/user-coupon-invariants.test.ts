import * as assert from 'assert';
import { InvalidCuponIdException } from 'src/cupon/domain/domain-exceptions/invalid-cupon-id-exception';
import { CuponId } from 'src/cupon/domain/value-object/cupon-id';
import { InvalidCuponUserAlreadyUsedException } from 'src/user/domain/entities/coupon/domain-exceptions/invalid-cupon-user-already-used-exception';
import { UserCoupon } from 'src/user/domain/entities/coupon/user-coupon.entity';
import { CuponState } from 'src/user/domain/entities/coupon/value-objects/cupon-state';


describe("User Coupon Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a user coupon with invalid directionId", () => {
    try {
        UserCoupon.create(
            CuponId.create('id-123'),
            CuponState.create('used')
        )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidCuponIdException,
      `Expected InvalidCuponIdException but got ${caughtError}`
    )
  })

  test("should not aply a user coupon when the coupon is already aplied", () => {
    try {
        let cupon=UserCoupon.create(
            CuponId.create('fd5235de-9533-4660-8b00-67448de3b767'),
            CuponState.create('used')
        )
        cupon.aplyCoupon()
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidCuponUserAlreadyUsedException,
      `Expected InvalidCuponUserAlreadyUsedException but got ${caughtError}`
    )
  })
})