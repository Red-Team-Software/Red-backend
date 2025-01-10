import * as assert from 'assert'
import { NegativeOrderShippingFeeException } from 'src/order/domain/exception/negative-order-shipping-fee-exception'
import { NegativeOrderTaxException } from 'src/order/domain/exception/negative-order-tax-exception'
import { OrderTaxes } from 'src/order/domain/value_objects/order-taxes'

describe("Order Taxes Invariants", () => {
    let caughtError: any

    beforeEach(() => {
        caughtError = null
    })

    test("should not create a Order Taxes with invalid data", () => {
        try {
            OrderTaxes.create(-10);
        } catch (error) {
            caughtError = error
        }
        assert.ok(
            caughtError instanceof NegativeOrderTaxException,
            `Expected NegativeOrderTaxException but got ${caughtError}`
        )
    })
})