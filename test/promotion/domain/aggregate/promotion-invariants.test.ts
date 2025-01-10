import * as assert from 'assert';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { Promotion } from 'src/promotion/domain/aggregate/promotion.aggregate';
import { PromotionId } from 'src/promotion/domain/value-object/promotion-id';
import { PromotionDescription } from 'src/promotion/domain/value-object/promotion-description';
import { PromotionName } from 'src/promotion/domain/value-object/promotion-name';
import { PromotionState } from 'src/promotion/domain/value-object/promotion-state';
import { PromotionDiscount } from 'src/promotion/domain/value-object/promotion-discount';
import { BundleId } from 'src/bundle/domain/value-object/bundle-id';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { InvalidPromotionIdException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-id-exception';
import { PromotionStateEnum } from 'src/promotion/domain/value-object/enum/promotion-state.enum';


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
            PromotionState.create(PromotionStateEnum.avaleable),
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