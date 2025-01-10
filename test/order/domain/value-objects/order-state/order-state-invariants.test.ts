import * as assert from 'assert'
import { InvalidOrderStateException } from 'src/order/domain/exception/invalid-order-state-exception'
import { OrderState } from 'src/order/domain/value_objects/order-state'

describe("Order State Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Order State with invalid data", () => {
    try {
      OrderState.create('inKitchen')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidOrderStateException,
      `Expected InvalidOrderStateException but got ${caughtError}`
    )
  })
})