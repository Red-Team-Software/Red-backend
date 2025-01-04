import * as assert from 'assert';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { Bundle } from 'src/bundle/domain/aggregate/bundle.aggregate';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { BundleDescription } from 'src/bundle/domain/value-object/bundle-description';
import { BundleCaducityDate } from 'src/bundle/domain/value-object/bundle-caducity-date';
import { BundleName } from 'src/bundle/domain/value-object/bundle-name';
import { BundleStock } from 'src/bundle/domain/value-object/bundle-stock';
import { BundleImage } from 'src/bundle/domain/value-object/bundle-image';
import { BundlePrice } from 'src/bundle/domain/value-object/bundle-price';
import { BundleWeigth } from 'src/bundle/domain/value-object/bundle-weigth';
import { InvalidBundleProductsIdException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-products-id-exception';


describe("Bundle Aggregate Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a bundle with two products id reapeted", () => {
    try {
        Bundle.initializeAggregate(
            BundleId.create('e09771db-2657-45fb-ad39-ae6604422787'),
            BundleDescription.create('Bundle Description'),
            BundleName.create('Bundle Name'),
            BundleStock.create(10),
            [
                BundleImage.create('http://image1.jpg'),
                BundleImage.create('http://image2.jpg')
            ],
            BundlePrice.create(100,'usd'),
            BundleWeigth.create(100,'kg'),
            [
                ProductID.create('e09771db-2657-45fb-ad39-ae6604422919'),
                ProductID.create('e09771db-2657-45fb-ad39-ae6604422919')
            ],
            BundleCaducityDate.create(new Date())
        )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleProductsIdException,
      `Expected InvalidBundleProductsIdException but got ${caughtError}`
    )
  })
})