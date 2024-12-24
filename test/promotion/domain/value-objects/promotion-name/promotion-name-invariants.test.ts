import * as assert from 'assert';
import { InvalidPromotionNameException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-name-exception';
import { PromotionName } from 'src/promotion/domain/value-object/promotion-name';

describe("Promotion Name Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Promotion name with invalid name", () => {
    try {
        PromotionName.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPromotionNameException,
      `Expected InvalidPromotionNameException but got ${caughtError}`
    )
  })
})