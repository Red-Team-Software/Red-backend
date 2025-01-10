import * as assert from 'assert';
import { Product } from 'src/product/domain/aggregate/product.aggregate';
import { ProductDescription } from 'src/product/domain/value-object/product-description';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { ProductName } from 'src/product/domain/value-object/product-name';
import { ProductStock } from 'src/product/domain/value-object/product-stock';
import { ProductPrice } from 'src/product/domain/value-object/product-price';
import { ProductWeigth } from 'src/product/domain/value-object/product-weigth';
import { ProductImage } from 'src/product/domain/value-object/product-image';
import { InvalidProductIdException } from 'src/product/domain/domain-exceptions/invalid-product-id-exception';


describe("Product Aggregate Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a product with invalid UserId", () => {
    try {
        Product.initializeAggregate(
            ProductID.create('product-123'),
            ProductDescription.create('Product Description'),
            ProductName.create('Product Name'),
            ProductStock.create(10),
            [
                ProductImage.create('image-1'),
                ProductImage.create('image-2')
            ],
            ProductPrice.create(10,'usd'),
            ProductWeigth.create(10,'kg')
        )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidProductIdException,
      `Expected InvalidProductIdException but got ${caughtError}`
    )
  })
})