import * as assert from 'assert';
import { InvalidCategoryNameException } from 'src/category/domain/domain-exceptions/invalid-category-name-exception';
import { CategoryName } from 'src/category/domain/value-object/category-name';

describe("Category Name Invariants", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create a Category name with an invalid name", () => {
    try {
      CategoryName.create('');
    } catch (error) {
      caughtError = error;
    }
    assert.ok(
      caughtError instanceof InvalidCategoryNameException,
      `Expected InvalidCategoryNameException but got ${caughtError}`
    );
  });

  test("should create a valid Category name", () => {
    const validName = CategoryName.create('Electronics');
    assert.ok(validName.equals(CategoryName.create('Electronics')));
  });
});
