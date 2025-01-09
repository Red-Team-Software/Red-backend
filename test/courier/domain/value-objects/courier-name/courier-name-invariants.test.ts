import * as assert from 'assert';
import { EmptyCourierNameException } from 'src/courier/domain/exceptions/empty-courier-name.exception';
import { CourierName } from 'src/courier/domain/value-objects/courier-name';

describe("Courier Name Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Courier name with invalid data", () => {
    try {
      CourierName.create('')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof EmptyCourierNameException,
      `Expected EmptyCourierNameException but got ${caughtError}`
    )
  })
})