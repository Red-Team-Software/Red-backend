import * as assert from 'assert';
import { Cupon } from 'src/cupon/domain/aggregate/cupon.aggregate';
import { CuponName } from 'src/cupon/domain/value-object/cupon-name';
import { CuponId } from 'src/cupon/domain/value-object/cupon-id';
import { ErrorNameAlreadyApplicationException } from 'src/cupon/application/application-exception/error-name-already-exist-cupon-application-exception';
import { CuponCode } from 'src/cupon/domain/value-object/cupon-code';
import { CuponDiscount } from 'src/cupon/domain/value-object/cupon-discount';
import { CuponState } from 'src/cupon/domain/value-object/cupon-state';
import { CouponStateEnum } from 'src/cupon/domain/value-object/enum/coupon.state.enum';
import { InvalidCuponIdException } from 'src/cupon/domain/domain-exceptions/invalid-cupon-id-exception';

describe("Cupon Aggregate Invariants", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create a cupon with invalid Id", async () => {
    // Cupon con nombre ya registrado
    try {Cupon.initializeAggregate(
      CuponId.create("12345"),
      CuponName.create("BlackFriday"),
      CuponCode.create('code'),
      CuponDiscount.create(20),
      CuponState.create(CouponStateEnum.avaleable)
    );

    } catch (error) {
      caughtError = error;
    }

    assert.ok(
      caughtError instanceof InvalidCuponIdException,
      `Expected InvalidCuponIdException but got ${caughtError}`
    );
  });

});
