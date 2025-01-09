import * as assert from 'assert'
import { InvalidOrderReportIdException } from 'src/order/domain/entities/report/exception/invalid-report-id-exception'
import { OrderReportId } from 'src/order/domain/entities/report/value-object/order-report-id'

describe("Report Id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Report id with invalid data", () => {
    try {
      OrderReportId.create('id-123')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidOrderReportIdException,
      `Expected InvalidOrderReportIdException but got ${caughtError}`
    )
  })
})