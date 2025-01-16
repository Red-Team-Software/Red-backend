
import * as assert from 'assert';
import { InvalidCuponIdException } from 'src/cupon/domain/domain-exceptions/invalid-cupon-id-exception';
import { CuponId } from 'src/cupon/domain/value-object/cupon-id';

describe("CuponID Invariant", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create CuponID with invalid value", () => {
    try {
      CuponId.create(""); // ID vacío
    } catch (error) {
      caughtError = error;
    }

    assert.ok(
      caughtError instanceof InvalidCuponIdException,
      `Expected InvalidCuponIdException but got ${caughtError}`
    );
  });

  test("should create CuponID with valid value", () => {
    let cuponID = CuponId.create("e09771db-2657-45fb-ad39-ae6604422919");

    assert.ok(cuponID, "CuponID should be created successfully");
    assert.strictEqual(cuponID.Value, "e09771db-2657-45fb-ad39-ae6604422919", "CuponID value should be 'e09771db-2657-45fb-ad39-ae6604422919'");
  });
});
