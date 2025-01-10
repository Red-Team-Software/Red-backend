import * as assert from 'assert'
import { EmptyOrderDirectionStreetException } from 'src/order/domain/exception/empty-order-direction-street.exception'
import { OrderAddressStreet } from 'src/order/domain/value_objects/order-direction-street'

describe("Order Address Street Invariants", () => {
    let caughtError: any

    beforeEach(() => {
        caughtError = null
    })

    test("should not create a Order Address Street with invalid data", () => {
        try {
            OrderAddressStreet.create('');
        } catch (error) {
            caughtError = error
        }
        assert.ok(
            caughtError instanceof EmptyOrderDirectionStreetException,
            `Expected EmptyOrderDirectionStreetException but got ${caughtError}`
        )
    })
})