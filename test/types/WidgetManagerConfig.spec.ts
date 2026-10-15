import { describe, it, expect } from '@jest/globals'
import { WidgetManagerConfig } from '../../src/types/WidgetManagerConfig'

const required = {
  trackingAllowed: false,
  language: 'de-DE',
  currencyCode: 'EUR',
  priceMode: 'gross' as const,
  taxCategories: { S: 19, AA: 7 },
  tecsafeArticles: [{ productNumber: 'TS-1', price: '9.99' }],
}

describe('WidgetManagerConfig', () => {
  it('allows its default widget URL', () => {
    const config = new WidgetManagerConfig(required)
    expect(config.allowedOrigins).toContain(
      new URL(config.widgetBaseURL).origin
    )
  })

  it('defaults both debug flags to false', () => {
    const config = new WidgetManagerConfig(required)
    expect(config.debugWidget).toBe(false)
    expect(config.sdkDebugger).toBe(false)
  })

  it('accepts both debug flags through the constructor', () => {
    const config = new WidgetManagerConfig({
      ...required,
      debugWidget: true,
      sdkDebugger: true,
    })
    expect(config.debugWidget).toBe(true)
    expect(config.sdkDebugger).toBe(true)
  })

  it('carries the tecsafe articles through the constructor', () => {
    const config = new WidgetManagerConfig(required)
    expect(config.tecsafeArticles).toEqual([
      { productNumber: 'TS-1', price: '9.99' },
    ])
  })
})
