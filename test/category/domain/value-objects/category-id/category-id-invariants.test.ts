import * as assert from 'assert';
import { InvalidCategoryIdException } from 'src/category/domain/domain-exceptions/invalid-category-id-exception';
import { CategoryID } from 'src/category/domain/value-object/category-id';

describe("Category ID Invariants", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create a Category ID with invalid id", () => {
    try {
      CategoryID.create('');
    } catch (error) {
      caughtError = error;
    }
    assert.ok(
      caughtError instanceof InvalidCategoryIdException,
      `Expected InvalidCategoryIdException but got ${caughtError}`
    );
  });

});
