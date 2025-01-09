import * as assert from 'assert';
import { EmptyCourierNameException } from 'src/courier/domain/exceptions/empty-courier-name.exception';
import { EmptyOrderReportDescriptionException } from 'src/order/domain/entities/report/exception/empty-order-report-description-exception';
import { OrderReportDescription } from 'src/order/domain/entities/report/value-object/order-report-description';

describe("Report description Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Report description with invalid data", () => {
    try {
      OrderReportDescription.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof EmptyOrderReportDescriptionException,
      `Expected EmptyOrderReportDescriptionException but got ${caughtError}`
    )
  })
})