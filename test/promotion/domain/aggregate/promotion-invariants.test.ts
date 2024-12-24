import * as assert from 'assert';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { InvalidProductIdException } from 'src/product/domain/domain-exceptions/invalid-product-id-exception';
import { Promotion } from 'src/promotion/domain/aggregate/promotion.aggregate';
import { PromotionId } from 'src/promotion/domain/value-object/promotion-id';
import { PromotionDescription } from 'src/promotion/domain/value-object/promotion-description';
import { PromotionName } from 'src/promotion/domain/value-object/promotion-name';
import { PromotionAvaleableState } from 'src/promotion/domain/value-object/promotion-avaleable-state';
import { PromotionDiscount } from 'src/promotion/domain/value-object/promotion-discount';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { InvalidPromotionIdException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-id-exception';


describe("Promotion Aggregate Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a promotion with invalid PromotionId", () => {
    try {
        Promotion.initializeAggregate(
            PromotionId.create('promotion-123'),
            PromotionDescription.create('Promotion Description'),
            PromotionName.create('Promotion Name'),
            PromotionAvaleableState.create(true),
            PromotionDiscount.create(0.10),
            [
                ProductID.create('e09771db-2657-45fb-ad39-ae6604422919')
            ],
            [
                BundleId.create('e09771db-2657-45fb-ad39-ae66044227841')
            ],
            [
                CategoryID.create('e09771db-2657-45fb-ad39-ae660442278')   
            ]
        )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPromotionIdException,
      `Expected InvalidPromotionIdException but got ${caughtError}`
    )
  })
})