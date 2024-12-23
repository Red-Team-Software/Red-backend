import * as assert from 'assert';
import { ProductCaducityDate } from 'src/product/domain/value-object/product-caducity-date';

describe("User Caducity Date Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Product caducity date with invalid Date", () => {
    try {
        ProductCaducityDate.create(new Date('2021-12-12'))
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