import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals'
import {
  readUrlParams,
  clearUrlParams,
  writeUrlParams,
} from '../../src/util/UrlParamRW'

describe('UrlParamRW', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', 'http://localhost/')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should write URL parameters correctly', () => {
    writeUrlParams({ url: 'https://test.com', browserId: 'test-id' })
    expect(window.location.href).toContain(
      'x-tecsafe-url=https%3A%2F%2Ftest.com'
    )
    expect(window.location.href).toContain('x-tecsafe-bid=test-id')
  })

  it('should read URL parameters correctly', () => {
    window.history.replaceState(
      {},
      '',
      'http://localhost/?x-tecsafe-url=https://test.com&x-tecsafe-bid=test-id'
    )
    const result = readUrlParams()
    expect(result.url).toBe('https://test.com')
    expect(result.browserId).toBe('test-id')
  })

  it('should return empty strings for missing params', () => {
    window.history.replaceState({}, '', 'http://localhost/')
    const result = readUrlParams()
    expect(result.url).toBe('')
    expect(result.browserId).toBe('')
  })

  it('should clear valid URL parameters without reloading', () => {
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState')
    window.history.replaceState(
      {},
      '',
      'http://localhost/?x-tecsafe-url=https://test.com&x-tecsafe-bid=test-id&other=value'
    )

    clearUrlParams()

    expect(replaceStateSpy).toHaveBeenCalledWith(
      {},
      '',
      expect.stringContaining('other=value')
    )
    const lastCallUrl =
      replaceStateSpy.mock.calls[replaceStateSpy.mock.calls.length - 1][2]
    expect(lastCallUrl).not.toContain('x-tecsafe-url')
    expect(lastCallUrl).not.toContain('x-tecsafe-bid')

    expect(window.location.href).not.toContain('x-tecsafe-url')
    expect(window.location.href).not.toContain('x-tecsafe-bid')
  })
})
