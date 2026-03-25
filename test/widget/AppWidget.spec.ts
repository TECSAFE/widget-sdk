import {
  expect,
  jest,
  describe,
  it,
  beforeEach,
  afterEach,
} from '@jest/globals'
import { AppWidget } from '../../src/widget/AppWidget'
import { WidgetManagerConfig } from '../../src/types/WidgetManagerConfig'

describe('AppWidget', () => {
  let config: WidgetManagerConfig
  let api: any
  let el: HTMLElement

  beforeEach(() => {
    config = {
      widgetBaseURL: 'https://test.com/widget',
      allowedOrigins: ['https://test.com'],
    } as any
    api = { getBrowserId: jest.fn().mockReturnValue('test-bid') }
    el = document.createElement('div')

    // Mock url params helper
    window.history.replaceState({}, '', 'http://localhost/')
  })

  afterEach(() => {
    document.body.innerHTML = ''
    jest.restoreAllMocks()
  })

  it('should initialize and preCreate properly', () => {
    const widget = new AppWidget(config, el, api)

    // Test preCreate effect
    ;(widget as any).preCreate()
    expect(document.body.contains((widget as any).el)).toBe(true)
  })

  it('should setUrl with allowed origin', () => {
    const widget = new AppWidget(config, el, api)

    // Test setUrl calls show -> that eventually writes url. Wait, setUrl directly writes url params.
    widget.setUrl('https://test.com/some/path')
    expect(widget.getUrl()).toBe('https://test.com/some/path')
    expect(window.location.href).toContain('x-tecsafe-url')
  })

  it('should throw on setUrl with disallowed origin', () => {
    const widget = new AppWidget(config, el, api)
    expect(() => {
      widget.setUrl('https://bad-origin.com/path')
    }).toThrow()
  })

  it('should reset parent page on hide/destroy', () => {
    const widget = new AppWidget(config, el, api)
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '15px'
    ;(widget as any).postHide()

    expect(document.body.style.overflow).toBe('')
    expect(document.body.style.paddingRight).toBe('')
  })

  it('should remove element on postDestroy', () => {
    const widget = new AppWidget(config, el, api)
    ;(widget as any).preCreate()
    expect(document.body.contains((widget as any).el)).toBe(true)
    ;(widget as any).postDestroy()
    expect(document.body.contains((widget as any).el)).toBe(false)
  })
})
