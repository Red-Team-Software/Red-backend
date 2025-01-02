import * as assert from 'assert';
import { InvalidPromotionStateException } from 'src/promotion/domain/domain-exceptions/invalid-promotion-state-exception';
import { PromotionState } from 'src/promotion/domain/value-object/promotion-state';

describe("Promotion State Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Promotion state with invalid state", () => {
    try {
        PromotionState.create('retirado')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidPromotionStateException,
      `Expected InvalidPromotionStateException but got ${caughtError}`
    )
  })
})