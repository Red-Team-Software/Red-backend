import * as assert from 'assert'
import { NegativeOrderTotalAmountException } from 'src/order/domain/exception/negative-order-total-amount-exception'
import { OrderTotalAmount } from 'src/order/domain/value_objects/order-totalAmount'

describe("Order Total Amount Negative Invariants", () => {
    let caughtError: any

    beforeEach(() => {
        caughtError = null
    })

    test("should not create a Order Total Amount with invalid data", () => {
        try {
            OrderTotalAmount.create(-10, 'usd');
        } catch (error) {
            caughtError = error
        }
        assert.ok(
            caughtError instanceof NegativeOrderTotalAmountException,
            `Expected NegativeOrderTotalAmountException but got ${caughtError}`
        )
    })
})