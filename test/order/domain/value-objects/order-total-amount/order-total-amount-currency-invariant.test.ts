import * as assert from 'assert'
import { InvalidCurrencyOrderTotalAmountException } from 'src/order/domain/exception/invalid-currency-total-amount-order-exception'
import { OrderTotalAmount } from 'src/order/domain/value_objects/order-totalAmount'

describe("Order Total Amount Currency Invariants", () => {
    let caughtError: any

    beforeEach(() => {
        caughtError = null
    })

    test("should not create a Order Total Amount with invalid data", () => {
        try {
            OrderTotalAmount.create(10, 'yuanes');
        } catch (error) {
            caughtError = error
        }
        assert.ok(
            caughtError instanceof InvalidCurrencyOrderTotalAmountException,
            `Expected InvalidCurrencyOrderTotalAmountException but got ${caughtError}`
        )
    })
})