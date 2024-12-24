import * as assert from 'assert';
import { InvalidPromotionIdException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-id-exception';
import { PromotionId } from 'src/promotion/domain/value-object/promotion-id';

describe("Promotion Id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Promotion Id with invalid id", () => {
    try {
        PromotionId.create('id-123')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPromotionIdException,
      `Expected InvalidPromotionIdException but got ${caughtError}`
    )
  })
})