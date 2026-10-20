import { describe, it, expect } from '@jest/globals'
import { OUT_MESSAGES } from '../../src/messages/Messages'
import type { LayoutPricesResponse } from '../../src'

const prices = {
  requestId: 'req-1',
  layout: {
    priceScales: [
      {
        fromQuantity: 1,
        unitPrice: '119.00',
        effectiveUnitPrice: '119.00',
        allowancesAndCharges: [],
      },
    ],
  },
  tecsafeServices: [],
}

describe('layout price response outcomes', () => {
  it('sends a correlated failure without fabricated pricing', () => {
    const response = OUT_MESSAGES.OutMessageLayoutPrices.create({
      requestId: 'failed-request',
      success: false,
      error: 'Could not calculate layout prices',
    })
    expect(JSON.parse(JSON.stringify(response))).toEqual({
      type: 'layout-prices',
      payload: {
        requestId: 'failed-request',
        success: false,
        error: 'Could not calculate layout prices',
      },
    })
  })

  it('permits failure without an error message', () => {
    expect(
      OUT_MESSAGES.OutMessageLayoutPrices.create({
        requestId: 'unavailable',
        success: false,
      }).payload
    ).toEqual({ requestId: 'unavailable', success: false })
  })

  it('keeps existing successes valid and supports an explicit success flag', () => {
    function display(response: LayoutPricesResponse): string {
      if (response.success === false) return response.error ?? 'Unavailable'
      return response.layout.priceScales[0].effectiveUnitPrice
    }
    expect(display(prices)).toBe('119.00')
    expect(display({ ...prices, success: true })).toBe('119.00')
    expect(display({ requestId: 'req-1', success: false })).toBe('Unavailable')
    expect(OUT_MESSAGES.OutMessageLayoutPrices.create(prices).payload).toEqual(
      prices
    )
  })

  it('requires a request ID and separates failure from successful pricing', () => {
    // @ts-expect-error Every response must echo its request ID.
    const missingId: LayoutPricesResponse = { success: false }
    // @ts-expect-error A successful response must include layout and service prices.
    const missingPrices: LayoutPricesResponse = {
      requestId: 'req-1',
      success: true,
    }
    const mixed = { ...prices, success: false as const }
    // @ts-expect-error A failure must not carry prices that could be used accidentally.
    const failureWithPrices: LayoutPricesResponse = mixed
    const badError = { requestId: 'req-1', success: false as const, error: 503 }
    // @ts-expect-error Error messages are strings, not numeric status codes.
    const numericError: LayoutPricesResponse = badError
    expect(
      OUT_MESSAGES.OutMessageLayoutPrices.create({
        requestId: 'req-1',
        success: true,
        layout: prices.layout,
        tecsafeServices: [],
      }).payload
    ).toMatchObject({ requestId: 'req-1', success: true })
  })
})
