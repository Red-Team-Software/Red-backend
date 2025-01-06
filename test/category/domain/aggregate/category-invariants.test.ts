import * as assert from 'assert';
import { Category } from 'src/category/domain/aggregate/category.aggregate';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { CategoryName } from 'src/category/domain/value-object/category-name';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { InvalidCategoryIdException } from 'src/category/domain/domain-exceptions/invalid-category-id-exception';
import { CategoryImage } from 'src/category/domain/value-object/category-image';

describe("Category Aggregate Invariants", () => {
  let caughtError: any;

  beforeEach(() => {
    caughtError = null;
  });

  test("should not create a category with an invalid CategoryID", () => {
    try {
      Category.initializeAggregate(
        CategoryID.create(''), // Invalid ID
        CategoryName.create('Electronics'),
        CategoryImage.create('image-1'),
        [
          ProductID.create('product-1'),
          ProductID.create('product-2')
        ],
        [
          BundleId.create('bundle-1'),
          BundleId.create('bundle-2')
        ]
      );
    } catch (error) {
      caughtError = error;
    }
    assert.ok(
      caughtError instanceof InvalidCategoryIdException,
      `Expected InvalidCategoryIdException but got ${caughtError}`
    );
  });

  test("should create a valid category with products and bundles", () => {
    const category = Category.initializeAggregate(
      CategoryID.create('category-123'),
      CategoryName.create('Electronics'),
      CategoryImage.create('image-1'),
      [
        ProductID.create('product-1'),
        ProductID.create('product-2')
      ],
      [
        BundleId.create('bundle-1'),
        BundleId.create('bundle-2')
      ]
    );

    assert.ok(category);
    assert.strictEqual(category.Id.Value, 'category-123');
    assert.strictEqual(category.Name.Value, 'Electronics');
    assert.strictEqual(category.Products.length, 2);
    assert.strictEqual(category.Bundles.length, 2);
  });
});
