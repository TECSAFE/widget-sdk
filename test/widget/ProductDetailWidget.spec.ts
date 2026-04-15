import { expect, describe, it, beforeEach } from '@jest/globals'
import { ProductDetailWidget } from '../../src/widget/ProductDetailWidget'
import { WidgetManagerConfig } from '../../src/types/WidgetManagerConfig'

describe('ProductDetailWidget', () => {
  let config: WidgetManagerConfig
  let api: any
  let el: HTMLElement

  beforeEach(() => {
    config = {
      widgetBaseURL: 'https://test.com',
      allowedOrigins: ['https://test.com'],
    } as any
    api = {}
    el = document.createElement('div')
  })

  it('should initialize with correct uiPath', () => {
    const widget = new ProductDetailWidget(config, el, api, 'test-article-123')
    expect((widget as any).uiPath).toBe('product-detail')
    expect(widget).toBeDefined()
  })
})
