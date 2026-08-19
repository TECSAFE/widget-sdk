import { describe, it, expect } from '@jest/globals'
import { WidgetManagerConfig } from '../../src/types/WidgetManagerConfig'

const required = {
  trackingAllowed: false,
  languageRFC4647: 'de-DE',
  currencyCodeISO4217: 'EUR',
  taxIncluded: true,
}

describe('WidgetManagerConfig', () => {
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
})
