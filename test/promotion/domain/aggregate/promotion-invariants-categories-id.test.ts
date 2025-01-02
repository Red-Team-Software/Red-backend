import * as assert from 'assert';
import { Promotion } from 'src/promotion/domain/aggregate/promotion.aggregate';
import { PromotionId } from 'src/promotion/domain/value-object/promotion-id';
import { PromotionDescription } from 'src/promotion/domain/value-object/promotion-description';
import { PromotionName } from 'src/promotion/domain/value-object/promotion-name';
import { PromotionState } from 'src/promotion/domain/value-object/promotion-state';
import { PromotionDiscount } from 'src/promotion/domain/value-object/promotion-discount';
import { CategoryID } from 'src/category/domain/value-object/category-id';
import { InvalidPromotionCategoriesIdException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-categories-id-exception';


describe("Promotion Aggregate Product ids Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a promotion with two products id reapeted", () => {
    try {
        Promotion.initializeAggregate(
          PromotionId.create("e09771db-2657-45fb-ad39-ae6604422787"),
          PromotionDescription.create("descripcion de prueba"),
          PromotionName.create("promotion test"),
          PromotionState.create('avaleable'),
          PromotionDiscount.create(0.1),
          [],
          [],
          [
            CategoryID.create("e09771db-2657-45fb-ad39-ae6604422919"),
            CategoryID.create('e09771db-2657-45fb-ad39-ae6604422919')
          ]
        )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPromotionCategoriesIdException,
      `Expected InvalidPromotionCategoriesIdException but got ${caughtError}`
    )
  })
})