import * as assert from 'assert';
import { ProductID } from 'src/product/domain/value-object/product-id';
import { Promotion } from 'src/promotion/domain/aggregate/promotion.aggregate';
import { PromotionId } from 'src/promotion/domain/value-object/promotion-id';
import { PromotionDescription } from 'src/promotion/domain/value-object/promotion-description';
import { PromotionName } from 'src/promotion/domain/value-object/promotion-name';
import { PromotionState } from 'src/promotion/domain/value-object/promotion-state';
import { PromotionDiscount } from 'src/promotion/domain/value-object/promotion-discount';
import { InvalidPromotionProductsIdException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-products-id-exception';


describe("Promotion Aggregate Product ids Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a promotion with products id reapeted", () => {
    try {
        Promotion.initializeAggregate(
          PromotionId.create("e09771db-2657-45fb-ad39-ae6604422787"),
          PromotionDescription.create("descripcion de prueba"),
          PromotionName.create("promotion test"),
          PromotionState.create('avaleable'),
          PromotionDiscount.create(0.1),
          [
            ProductID.create("e09771db-2657-45fb-ad39-ae6604422919"),
            ProductID.create('e09771db-2657-45fb-ad39-ae6604422919')
          ],
          [],
          []
        )
    } 
    catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPromotionProductsIdException,
      `Expected InvalidPromotionProductsIdException but got ${caughtError}`
    )
  })
})