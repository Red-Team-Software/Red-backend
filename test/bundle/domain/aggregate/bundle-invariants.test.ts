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
import { InvalidBundleIdException } from 'src/bundle/domain/domain-exceptions/invalid-bundle-id-exception';


describe("Bundle Aggregate Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a bundle with invalid bundleId", () => {
    try {
        Bundle.initializeAggregate(
            BundleId.create('bundle-123'),
            BundleDescription.create('Bundle Description'),
            BundleCaducityDate.create(new Date()),
            BundleName.create('Bundle Name'),
            BundleStock.create(10),
            [
                BundleImage.create('image1'),
                BundleImage.create('image2')
            ],
            BundlePrice.create(100,'usd'),
            BundleWeigth.create(100,'kg'),
            [
                ProductID.create('e09771db-2657-45fb-ad39-ae6604422919'),
                ProductID.create('e09771db-2657-45fb-ad39-ae6604422848')
            ]
        )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidBundleIdException,
      `Expected InvalidBundleException but got ${caughtError}`
    )
  })
})