import * as assert from 'assert';
import { InvalidPromotionDiscountException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-discount-exception';
import { PromotionDiscount } from 'src/promotion/domain/value-object/promotion-discount';

describe("Promotion Discount Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Promotion discount with invalid discount", () => {
    try {
        PromotionDiscount.create(10)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPromotionDiscountException,
      `Expected InvalidPromotionDiscountException but got ${caughtError}`
    )
  })
})