import * as assert from 'assert'
import { InvalidOrderIdException } from 'src/order/domain/exception/invalid-order-id-exception'
import { OrderId } from 'src/order/domain/value_objects/order-id'

describe("Order Id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Order id with invalid data", () => {
    try {
      OrderId.create('id-123')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidOrderIdException,
      `Expected InvalidOrderIdException but got ${caughtError}`
    )
  })
})