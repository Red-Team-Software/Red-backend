import * as assert from 'assert';
import { InvalidCuponStateException } from 'src/cupon/domain/domain-exceptions/invalid-cupon-state-exception';
import { CuponState } from 'src/cupon/domain/value-object/cupon-state';
import { CouponStateEnum } from 'src/cupon/domain/value-object/enum/coupon.state.enum';

describe("CuponState Invariant", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create CuponState with invalid state", () => {
    try {
      CuponState.create("invalid_state"); // Estado no válido
    } catch (error) {
      caughtError = error;
    }

    assert.ok(
      caughtError instanceof InvalidCuponStateException,
      `Expected InvalidCuponStateException but got ${caughtError}`
    );
  });

  test("should create CuponState with valid state 'avaleable'", () => {
    let cuponState = CuponState.create(CouponStateEnum.avaleable);

    assert.ok(cuponState, "CuponState should be created successfully");
    assert.strictEqual(cuponState.Value, "avaleable", "CuponState value should be 'avaleable'");
  });

  test("should create CuponState with valid state 'unavaleable'", () => {
    let cuponState = CuponState.create(CouponStateEnum.unavaleable);

    assert.ok(cuponState, "CuponState should be created successfully");
    assert.strictEqual(cuponState.Value, "unavaleable", "CuponState value should be 'unavaleable'");
  });

});
