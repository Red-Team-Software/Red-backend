import * as assert from 'assert';
import { InvalidCuponDiscountException } from 'src/cupon/domain/domain-exceptions/invalid-cupon-discount-exception';
import { CuponDiscount } from 'src/cupon/domain/value-object/cupon-discount';

describe("CuponDiscount Invariant", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create CuponDiscount with negative value", () => {
    try {
      CuponDiscount.create(-10); // Descuento negativo
    } catch (error) {
      caughtError = error;
    }

    assert.ok(
      caughtError instanceof InvalidCuponDiscountException,
      `Expected InvalidCuponDiscountException but got ${caughtError}`
    );
  });

  test("should not create CuponDiscount with value greater than 1", () => {
    try {
      CuponDiscount.create(2);
    } catch (error) {
      caughtError = error;
    }

    assert.ok(
      caughtError instanceof InvalidCuponDiscountException,
      `Expected InvalidCuponDiscountException but got ${caughtError}`
    );
  });

  test("should create CuponDiscount with valid value", () => {
    let cuponDiscount = CuponDiscount.create(0.5); // 50%

    assert.ok(cuponDiscount, "CuponDiscount should be created successfully");
    assert.strictEqual(cuponDiscount.Value, 0.5, "CuponDiscount value should be '0.5'");
  });
});
