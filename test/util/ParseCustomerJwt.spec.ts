import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals'
import { parseCustomerJwt } from '../../src/util/ParseCustomerJwt'
import { Logger } from '../../src/util/Logger'

describe('parseCustomerJwt', () => {
  let errorSpy: any

  beforeEach(() => {
    errorSpy = jest
      .spyOn(Logger.getInstance(), 'error')
      .mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should parse a valid JWT correctly', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const bodyObj = { exp: 1234567890, userId: 'test-user' }
    const body = btoa(JSON.stringify(bodyObj))
    const validToken = `${header}.${body}.signature`

    const parsed = parseCustomerJwt(validToken)
    expect(parsed).toEqual(bodyObj)
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('should return null and log an error for an invalid token structure', () => {
    const invalidToken = 'not-a-token'
    const parsed = parseCustomerJwt(invalidToken)
    expect(parsed).toBeNull()
    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to parse customer JWT',
      expect.stringContaining('Invalid token structure')
    )
  })

  it('should handle unparseable base64 tokens by returning null', () => {
    const invalidToken = 'header.invalid_base64!.signature'
    const parsed = parseCustomerJwt(invalidToken)
    expect(parsed).toBeNull()
    expect(errorSpy).toHaveBeenCalled()
  })
})
