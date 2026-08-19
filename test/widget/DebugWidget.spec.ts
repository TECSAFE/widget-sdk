import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals'
import { DebugWidget } from '../../src/widget/DebugWidget'
import { WidgetManagerConfig } from '../../src/types/WidgetManagerConfig'

describe('DebugWidget', () => {
  let config: WidgetManagerConfig
  let el: HTMLElement

  beforeEach(() => {
    config = {
      widgetBaseURL: 'https://test.com/iframe',
      allowedOrigins: ['https://test.com'],
      iframeTransition: 'all 0.3s',
    } as WidgetManagerConfig
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    jest.restoreAllMocks()
  })

  it('loads the debug console from the widget base URL', () => {
    const widget = new DebugWidget(config, el, {
      _triggerListeners: jest.fn(),
    } as never)
    widget.show()
    expect(widget.getIframe()?.src).toBe('https://test.com/iframe/debug')
  })
})
