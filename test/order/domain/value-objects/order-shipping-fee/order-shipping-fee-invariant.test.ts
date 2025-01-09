import * as assert from 'assert'
import { NegativeOrderShippingFeeException } from 'src/order/domain/exception/negative-order-shipping-fee-exception'
import { OrderShippingFee } from 'src/order/domain/value_objects/order-shipping-fee'

describe("Order Shipping Fee Invariants", () => {
    let caughtError: any

    beforeEach(() => {
        caughtError = null
    })

    test("should not create a Order Shipping Fee with invalid data", () => {
        try {
            OrderShippingFee.create(-10);
        } catch (error) {
            caughtError = error
        }
        assert.ok(
            caughtError instanceof NegativeOrderShippingFeeException,
            `Expected NegativeOrderShippingFeeException but got ${caughtError}`
        )
    })
})