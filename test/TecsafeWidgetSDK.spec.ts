import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals'
import { TecsafeWidgetManager } from '../src/TecsafeWidgetSDK'
import { WidgetManagerConfig } from '../src/types/WidgetManagerConfig'
import { IN_MESSAGES, OUT_MESSAGES } from '../src/messages/Messages'
import { readUrlParams, writeUrlParams } from '../src/util/UrlParamRW'
const requiredMessages = () => [
  IN_MESSAGES.InMessageCartPunchout,
  IN_MESSAGES.InMessageRequestArticleInfo,
  IN_MESSAGES.InMessageRequestLayoutPrices,
]

const registerRequired = (manager: TecsafeWidgetManager) => {
  for (const message of requiredMessages()) manager.on(message as any, () => {})
}

describe('TecsafeWidgetManager', () => {
  let mockTokenCallback: any
  let mockConfig: WidgetManagerConfig

  beforeEach(() => {
    const testTokenBody = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })
    )
    const validTestToken = `header.${testTokenBody}.signature`

    mockTokenCallback = jest
      .fn<(oldToken?: string) => Promise<string>>()
      .mockResolvedValue(validTestToken)
    mockConfig = {
      widgetBaseURL: 'https://test.tecsafe.com/widget',
      allowedOrigins: ['https://test.tecsafe.com'],
    } as WidgetManagerConfig

    window.history.replaceState({}, '', 'http://localhost/')

    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {}
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value.toString()
        }),
        clear: jest.fn(() => {
          store = {}
        }),
      }
    })()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it('should initialize correctly with valid config', () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    expect(manager).toBeDefined()
    expect(manager.getConfig()).toBe(mockConfig)
    expect(manager.getBrowserId()).toBeDefined()
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'tecsafe-bid',
      expect.any(String)
    )
  })

  it('should throw an error if widgetBaseURL is not in allowedOrigins', () => {
    mockConfig.allowedOrigins = ['https://other.com']
    expect(() => {
      new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    }).toThrow('The widgetBaseURL must be in the allowedOrigins list')
  })

  it('should resume browserId from localStorage if available', () => {
    window.localStorage.setItem('tecsafe-bid', 'existing-bid')
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    expect(manager.getBrowserId()).toBe('existing-bid')
  })

  it('should create product detail widget', () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    const el = document.createElement('div')
    registerRequired(manager)
    const widget = manager.createProductDetailWidget(el, 'test-article-123')
    expect(widget).toBeDefined()
    expect(manager.getWidgets()).toContain(widget)
  })

  it('should destroy all widgets', async () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    const cartEl = document.createElement('div')
    registerRequired(manager)
    manager.createProductDetailWidget(cartEl, 'test-article-123')

    expect(manager.getWidgets().length).toBe(1)

    try {
      await (manager as any).saveToken('test')
    } catch (e) {}

    await manager.destroyAll()

    expect(manager.getWidgets().length).toBe(0)
  })

  it('should open and close full screen', () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    const appWidget = manager.getAppWidget()
    jest.spyOn(appWidget, 'setUrl').mockImplementation(() => {})
    jest.spyOn(appWidget, 'hide').mockImplementation(() => {})
    jest.spyOn(appWidget, 'destroy').mockImplementation(() => {})
    const sendSpy = jest.spyOn(manager, 'sendToAllWidgets')

    registerRequired(manager)
    manager.openFullScreen('https://test.com')
    expect(appWidget.setUrl).toHaveBeenCalledWith('https://test.com')
    expect(sendSpy).toHaveBeenCalled()

    manager.closeFullScreen()
    expect(appWidget.hide).toHaveBeenCalled()

    manager.destroyFullScreen()
    expect(appWidget.destroy).toHaveBeenCalled()
  })

  it('should create custom page widget', () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    const el = document.createElement('div')
    registerRequired(manager)
    const widget = manager.createCustomPageWidget(el)
    expect(widget).toBeDefined()
    expect(manager.getWidgets()).toContain(widget)
  })

  it('should refuse to create the debug widget when the flag is off', () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    expect(() =>
      manager.createDebugWidget(document.createElement('div'))
    ).toThrow(
      'createDebugWidget requires WidgetManagerConfig.debugWidget = true'
    )
  })

  it('should create and register the debug widget when the flag is on', () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, {
      ...mockConfig,
      debugWidget: true,
    } as WidgetManagerConfig)
    const el = document.createElement('div')
    document.body.appendChild(el)
    const widget = manager.createDebugWidget(el)
    expect(manager.getWidgets()).toContain(widget)
    expect(widget.getIframe()?.src).toBe(
      'https://test.tecsafe.com/widget/debug'
    )
  })

  it('should tear the debug widget down in destroyAll', async () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, {
      ...mockConfig,
      debugWidget: true,
    } as WidgetManagerConfig)
    const el = document.createElement('div')
    document.body.appendChild(el)
    const widget = manager.createDebugWidget(el)
    await manager.destroyAll()
    expect(manager.getWidgets().length).toBe(0)
    expect(widget.getIframe()).toBeNull()
  })

  it('does not touch the page when sdkDebugger is off', () => {
    document.body.innerHTML = ''
    new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    expect(document.body.childElementCount).toBe(0)
  })

  it('mounts the debug overlay when sdkDebugger is on', () => {
    document.body.innerHTML = ''
    new TecsafeWidgetManager(mockTokenCallback, {
      ...mockConfig,
      sdkDebugger: true,
    } as WidgetManagerConfig)
    const host = document.body.firstElementChild as HTMLElement
    expect(host.shadowRoot?.querySelector('.launcher')).toBeTruthy()
  })

  it('tears the debug overlay down in destroyAll', async () => {
    document.body.innerHTML = ''
    const manager = new TecsafeWidgetManager(mockTokenCallback, {
      ...mockConfig,
      sdkDebugger: true,
    } as WidgetManagerConfig)
    await manager.destroyAll()
    expect(document.body.childElementCount).toBe(0)
  })

  it('should test token methods', async () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)

    const token = await manager.getToken()
    expect(token).toBeDefined()
    expect(mockTokenCallback).toHaveBeenCalledWith(undefined)

    // getters
    manager.setFullScreenData({ foo: 'bar' })
    expect(manager.getFullScreenData()).toEqual({ foo: 'bar' })
    expect(manager.getTokenTimeout()).toBeGreaterThan(Date.now())
  })

  it('should pass old token if it exists in local storage', async () => {
    window.localStorage.setItem('tecsafe-token', 'old-test-token')
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    await manager.getToken()
    expect(mockTokenCallback).toHaveBeenCalledWith('old-test-token')
  })

  it('should handle on/once/off properly', () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    const handler = jest.fn<any>()
    manager.on({ type: 'test' } as any, handler)
    manager.once({ type: 'test' } as any, handler)
    manager.off({ type: 'test' } as any, handler)
  })

  it('should handle emit and sendToAllWidgets properly', () => {
    const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
    const spy = jest
      .spyOn(manager, 'sendToAllWidgets')
      .mockImplementation(() => {})
    manager.emit({ type: 'test', create: () => ({}) } as any, {})
    expect(spy).toHaveBeenCalled()
  })

  describe('required business events', () => {
    it('does not install business handlers in the constructor', () => {
      const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
      expect(manager.getMessageListeners()).toEqual([])
    })

    it.each(['product', 'custom', 'fullscreen'])(
      'rejects %s creation with all missing events before DOM changes',
      (kind) => {
        const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
        const el = document.createElement('div')
        const addListener = jest.spyOn(window, 'addEventListener')
        const create = () => {
          if (kind === 'product') manager.createProductDetailWidget(el, 'ART-1')
          else if (kind === 'custom') manager.createCustomPageWidget(el)
          else manager.openFullScreen('https://test.tecsafe.com/editor')
        }
        expect(create).toThrow(
          /cart-punchout.*request-article-info.*request-layout-prices/
        )
        expect(create).toThrow(/manager\.on/)
        expect(el.childElementCount).toBe(0)
        expect(manager.getWidgets()).toHaveLength(0)
        expect(manager.getAppWidget().getIframe()).toBeNull()
        expect(addListener).not.toHaveBeenCalled()
        addListener.mockRestore()
      }
    )

    it('reports only missing handlers and rechecks after off()', () => {
      const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
      registerRequired(manager)
      const handler = () => {}
      manager.on(IN_MESSAGES.InMessageCartPunchout, handler)
      manager.off(IN_MESSAGES.InMessageCartPunchout, handler)
      expect(() =>
        manager.createCustomPageWidget(document.createElement('div'))
      ).not.toThrow()
      const articleHandler = () => {}
      const fresh = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
      fresh.on(IN_MESSAGES.InMessageRequestArticleInfo, articleHandler)
      fresh.on(IN_MESSAGES.InMessageCartPunchout, handler)
      fresh.on(IN_MESSAGES.InMessageRequestLayoutPrices, handler)
      fresh.off(IN_MESSAGES.InMessageRequestArticleInfo, articleHandler)
      expect(() =>
        fresh.createCustomPageWidget(document.createElement('div'))
      ).toThrow(/Missing required event handlers: request-article-info\./)
    })

    it('rechecks consumed once handlers', () => {
      const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
      manager.on(IN_MESSAGES.InMessageRequestArticleInfo, () => {})
      manager.on(IN_MESSAGES.InMessageRequestLayoutPrices, () => {})
      manager.once(IN_MESSAGES.InMessageCartPunchout, () => {})
      const widget = manager.createCustomPageWidget(
        document.createElement('div')
      )
      manager._triggerListeners(
        'cart-punchout',
        IN_MESSAGES.InMessageCartPunchout.create({
          positions: [],
          tecsafeTotal: 0,
        }),
        widget
      )
      expect(() =>
        manager.createCustomPageWidget(document.createElement('div'))
      ).toThrow(/cart-punchout/)
    })

    it('restores fullscreen after synchronous event registration', async () => {
      localStorage.setItem('tecsafe-bid', 'existing-bid')
      writeUrlParams({
        browserId: 'existing-bid',
        url: 'https://test.tecsafe.com/editor',
      })
      const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
      expect(manager.getAppWidget().getIframe()).toBeNull()
      registerRequired(manager)
      await Promise.resolve()
      expect(manager.getAppWidget().getIframe()?.src).toBe(
        'https://test.tecsafe.com/editor'
      )
      await manager.destroyAll()
    })

    it.each(['closeFullScreen', 'destroyFullScreen', 'destroyAll'] as const)(
      'cancels pending fullscreen and clears persisted URL on %s',
      async (method) => {
        localStorage.setItem('tecsafe-bid', 'existing-bid')
        writeUrlParams({
          browserId: 'existing-bid',
          url: 'https://test.tecsafe.com/editor',
        })
        const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
        registerRequired(manager)
        await manager[method]()
        await Promise.resolve()
        expect(manager.getAppWidget().getIframe()).toBeNull()
        expect(readUrlParams()).toEqual({ browserId: '', url: '' })
      }
    )

    it.each([
      [
        IN_MESSAGES.InMessageRequestArticleInfo,
        OUT_MESSAGES.OutMessageArticleInfo,
      ],
      [
        IN_MESSAGES.InMessageRequestLayoutPrices,
        OUT_MESSAGES.OutMessageLayoutPrices,
      ],
      [
        IN_MESSAGES.InMessageCartPunchout,
        OUT_MESSAGES.OutMessageCartPunchoutResult,
      ],
    ])(
      'routes $type browser messages and targets the requesting iframe',
      async (request, response) => {
        const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
        registerRequired(manager)
        const first = document.createElement('div')
        const second = document.createElement('div')
        document.body.append(first, second)
        const widget = manager.createCustomPageWidget(first)
        const other = manager.createCustomPageWidget(second)
        const postMessage = jest.spyOn(
          widget.getIframe()!.contentWindow!,
          'postMessage'
        )
        const otherPostMessage = jest.spyOn(
          other.getIframe()!.contentWindow!,
          'postMessage'
        )
        const reply = response.create(response.preset() as never)
        const handler = jest.fn((e: any) => e.respond(reply))
        manager.on(request as any, handler)
        const data = request.create(request.preset() as never)

        window.dispatchEvent(
          new MessageEvent('message', {
            origin: 'https://foreign.example',
            source: widget.getIframe()!.contentWindow,
            data,
          })
        )
        window.dispatchEvent(
          new MessageEvent('message', {
            origin: 'https://test.tecsafe.com',
            source: window,
            data,
          })
        )
        expect(handler).not.toHaveBeenCalled()

        window.dispatchEvent(
          new MessageEvent('message', {
            origin: 'https://test.tecsafe.com',
            source: widget.getIframe()!.contentWindow,
            data,
          })
        )
        await Promise.resolve()
        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler.mock.calls[0][0].event).toEqual(data.payload)
        expect(postMessage).toHaveBeenCalledWith(
          reply,
          'https://test.tecsafe.com'
        )
        expect(otherPostMessage).not.toHaveBeenCalled()
        await manager.destroyAll()
        postMessage.mockRestore()
        otherPostMessage.mockRestore()
      }
    )

    it('routes punchout to a registered handler and responds to the requesting widget', () => {
      const manager = new TecsafeWidgetManager(mockTokenCallback, mockConfig)
      const payload = { positions: [], tecsafeTotal: 299.25 }
      manager.on(IN_MESSAGES.InMessageCartPunchout, (e) => {
        expect(e.event).toEqual(payload)
        e.respond(
          OUT_MESSAGES.OutMessageCartPunchoutResult.create({ success: true })
        )
      })
      const widget = { sendMessage: jest.fn() } as any
      manager._triggerListeners(
        'cart-punchout',
        IN_MESSAGES.InMessageCartPunchout.create(payload),
        widget
      )
      expect(widget.sendMessage).toHaveBeenCalledWith({
        type: 'cart-punchout-result',
        payload: { success: true },
      })
    })
  })
})
