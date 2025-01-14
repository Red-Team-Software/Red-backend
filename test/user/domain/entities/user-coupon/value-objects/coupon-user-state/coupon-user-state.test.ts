import * as assert from 'assert';
import { InvalidCuponUserAlreadyUsedException } from 'src/user/domain/entities/coupon/domain-exceptions/invalid-cupon-user-already-used-exception';
import { InvalidCuponUserStateException } from 'src/user/domain/entities/coupon/domain-exceptions/invalid-cupon-user-state-exception';
import { CuponState } from 'src/user/domain/entities/coupon/value-objects/cupon-state';


describe("User Coupon state Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a user coupon state that is already aplied", () => {
    try {
            let cupon=CuponState.create('used')
            cupon.changeUsed()

        } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidCuponUserAlreadyUsedException,
      `Expected InvalidCuponUserAlreadyUsedException but got ${caughtError}`
    )
  })

  test("should not create a user coupon state that is not avaleable", () => {
    try {
            CuponState.create('test')
        } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidCuponUserStateException,
      `Expected InvalidCuponUserStateException but got ${caughtError}`
    )
  })
})