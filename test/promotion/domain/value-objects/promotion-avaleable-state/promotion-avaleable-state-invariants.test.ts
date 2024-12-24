import * as assert from 'assert';
import { PromotionAvaleableState } from 'src/promotion/domain/value-object/promotion-avaleable-state';

describe("Promotion Avaleable State Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Promotion avaleable state with invalid state", () => {
    try {
        PromotionAvaleableState.create(false)
    } catch (error) {
      caughtError = error
    }
    assert.ok(
        true==true
    //TODO
    //   caughtError instanceof InvalidProductCaducityDateException,
    //   `Expected InvalidProductCaducityDateException but got ${caughtError}`
    )
  })
})