import * as assert from 'assert';
import { CuponName } from 'src/cupon/domain/value-object/cupon-name';
import { InvalidCuponNameException } from 'src/cupon/domain/domain-exceptions/invalid-cupon-name-exception';

describe("CuponName Invariant", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create CuponName with empty value", () => {
    try {
      CuponName.create(""); // Nombre vacío
    } catch (error) {
      caughtError = error;
    }

    assert.ok(
      caughtError instanceof InvalidCuponNameException,
      `Expected InvalidCuponNameException but got ${caughtError}`
    );
  });

  test("should create CuponName with valid value", () => {
    let cuponName = CuponName.create("BlackFriday");

    assert.ok(cuponName, "CuponName should be created successfully");
    assert.strictEqual(cuponName.Value, "BlackFriday", "CuponName value should be 'BlackFriday'");
  });
});
