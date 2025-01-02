import * as assert from 'assert';
import { InvalidPromotionDescriptionException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-description-exception';
import { PromotionDescription } from 'src/promotion/domain/value-object/promotion-description';

describe("Promotion Description Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Promotion Description with invalid description", () => {
    try {
        PromotionDescription.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPromotionDescriptionException,
      `Expected InvalidPromotionDescriptionException but got ${caughtError}`
    )
  })
})