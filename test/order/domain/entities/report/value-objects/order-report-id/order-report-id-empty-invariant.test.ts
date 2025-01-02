import * as assert from 'assert'
import { EmptyOrderReportIdException } from 'src/order/domain/entities/report/exception/empty-order-report-id-exception'
import { OrderReportId } from 'src/order/domain/entities/report/value-object/order-report-id'

describe("Report Id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Report id with invalid data", () => {
    try {
      OrderReportId.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof EmptyOrderReportIdException,
      `Expected EmptyOrderReportIdException but got ${caughtError}`
    )
  })
})