import {
  expect,
  jest,
  describe,
  it,
  beforeEach,
  afterEach,
} from '@jest/globals'
import { BaseWidget } from '../../src/types/BaseWidget'
import { WidgetManagerConfig } from '../../src/types/WidgetManagerConfig'
import { TecsafeWidgetManager } from '../../src/TecsafeWidgetSDK'
import { OutMessageAddedToCart } from '../../src/messages/out/AddedToCart'
import { Logger } from '../../src/util/Logger'
import { InMessagePing } from '../../src/messages/in/Ping'

class ConcreteBaseWidget extends BaseWidget {
  public uiPath = 'test-path'
  // Expose protected methods for testing
  public testOnMessage(event: MessageEvent) {
    return (this as any).onMessage(event)
  }
}

describe('BaseWidget', () => {
  let config: WidgetManagerConfig
  let api: any
  let el: HTMLElement
  let widget: ConcreteBaseWidget

  beforeEach(() => {
    config = {
      widgetBaseURL: 'https://test.com/widget',
      allowedOrigins: ['https://test.com'],
      iframeTransition: 'all 0.3s',
    } as any
    api = {
      _triggerListeners: jest.fn(),
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    widget = new ConcreteBaseWidget(config, el, api as any)

    jest.spyOn(Logger.getInstance(), 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('should initialize without iframe', () => {
    expect(widget.isOpen()).toBe(false)
    expect(widget.getIframe()).toBeNull()
  })

  it('should properly show() and create iframe', () => {
    widget.show()
    expect(widget.isOpen()).toBe(true)
    const iframe = widget.getIframe()
    expect(iframe).not.toBeNull()
    expect(iframe?.src).toBe('https://test.com/widget/test-path')
    expect(iframe?.style.display).toBe('')
  })

  it('should set display block on subsequent show() calls', () => {
    widget.show()
    widget.hide()
    widget.show()
    expect(widget.getIframe()?.style.display).toBe('block')
  })

  it('should only show() if iframe already created', () => {
    widget.show()
    const iframe = widget.getIframe()
    if (iframe) iframe.style.display = 'none'
    expect(widget.isOpen()).toBe(false)
    widget.show()
    expect(widget.isOpen()).toBe(true)
  })

  it('should properly hide() without destroying iframe', () => {
    widget.show()
    expect(widget.isOpen()).toBe(true)
    widget.hide()
    expect(widget.isOpen()).toBe(false)
    expect(widget.getIframe()).not.toBeNull()
  })

  it('should do nothing on hide() if not created', () => {
    expect(() => widget.hide()).not.toThrow()
  })

  it('should properly destroy() iframe', () => {
    widget.show()
    expect(widget.getIframe()).not.toBeNull()
    widget.destroy()
    expect(widget.getIframe()).toBeNull()
    expect(widget.isOpen()).toBe(false)
  })

  it('should do nothing on destroy() if not created', () => {
    expect(() => widget.destroy()).not.toThrow()
  })

  it('should sendMessage to iframe', () => {
    widget.show()
    const iframe = widget.getIframe()!
    const postMessageSpy = jest.spyOn(iframe.contentWindow!, 'postMessage')

    // valid origin
    const msg = OutMessageAddedToCart.create({ linePosition: 1, success: true })
    widget.sendMessage(msg)
    expect(postMessageSpy).toHaveBeenCalledWith(msg, 'https://test.com')
  })

  it('should block sendMessage if iframe origin missing/disallowed', () => {
    widget.show()
    const iframe = widget.getIframe()!
    const postMessageSpy = jest.spyOn(iframe.contentWindow!, 'postMessage')

    // Change src to a disallowed origin
    Object.defineProperty(iframe, 'src', {
      writable: true,
      value: 'https://disallowed.com/widget',
    })

    const msg = OutMessageAddedToCart.create({ linePosition: 1, success: true })
    widget.sendMessage(msg)
    expect(postMessageSpy).not.toHaveBeenCalled()
  })

  it('should do nothing on sendMessage if iframe is null', () => {
    expect(() =>
      widget.sendMessage(
        OutMessageAddedToCart.create({ linePosition: 1, success: true })
      )
    ).not.toThrow()
  })

  it('should throw on emit() with unsupported message type', () => {
    expect(() => {
      widget.emit({ type: 'UNKNOWN', create: () => ({}) } as any, {})
    }).toThrow('Only outgoing messages can be emitted')
  })

  it('should emit() properly for outgoing message type', () => {
    widget.show()
    const iframe = widget.getIframe()!
    const postMessageSpy = jest.spyOn(iframe.contentWindow!, 'postMessage')

    widget.emit(OutMessageAddedToCart, { linePosition: 1, success: true })
    expect(postMessageSpy).toHaveBeenCalled()
  })

  it('should register on, once, off properly', () => {
    const handler = jest.fn<any>()
    widget.on(OutMessageAddedToCart, handler)
    widget.off(OutMessageAddedToCart, handler)
    widget.once(OutMessageAddedToCart, handler)
  })

  it('should process onMessage properly for valid type', async () => {
    widget.show()

    const validEvent = new MessageEvent('message', {
      origin: 'https://test.com',
      source: widget.getIframe()!.contentWindow,
      data: { type: InMessagePing.type, payload: {} },
    })

    await widget.testOnMessage(validEvent)
    expect(api._triggerListeners).toHaveBeenCalled()
  })

  it('should ignore onMessage if origins or shapes differ', async () => {
    widget.show()
    const event = new MessageEvent('message', {
      origin: 'https://unrelated.com',
      data: { type: 'something' },
    })
    await widget.testOnMessage(event)
    expect(api._triggerListeners).not.toHaveBeenCalled()
  })
})
