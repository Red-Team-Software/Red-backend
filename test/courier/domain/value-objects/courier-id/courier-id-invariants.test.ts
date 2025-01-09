import * as assert from 'assert'
import { InvalidCourierIdException } from 'src/courier/domain/exceptions/invalid-courier-id-form.eception'
import { CourierId } from 'src/courier/domain/value-objects/courier-id'

describe("Courier Id Invariants", () => {
  let caughtError: any

  beforeEach(() => {
    caughtError = null
  })

  test("should not create a Courier id with invalid data", () => {
    try {
      CourierId.create('id-123')
    } catch (error) {
      caughtError = error
    }
    assert.ok(
      caughtError instanceof InvalidCourierIdException,
      `Expected InvalidCourierIdException but got ${caughtError}`
    )
  })
})