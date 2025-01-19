import * as assert from 'assert';
import { InvalidCategoryImageException } from 'src/category/domain/domain-exceptions/invalid-category-image-exception';
import { CategoryImage } from 'src/category/domain/value-object/category-image';

describe("Category Image Invariants", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create a Category image with an invalid URL", () => {
    try {
      CategoryImage.create('invalid-url');
    } catch (error) {
      caughtError = error;
    }
    assert.ok(
      caughtError instanceof InvalidCategoryImageException,
      `Expected InvalidCategoryImageException but got ${caughtError}`
    );
  });

  test("should create a valid Category image", () => {
    const validImage = CategoryImage.create('http://image-123.jpg');
    assert.ok(validImage.equals(CategoryImage.create('http://image-123.jpg')));
  });
});
