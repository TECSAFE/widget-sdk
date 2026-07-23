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
import { IN_MESSAGES } from '../src/messages/Messages'
import type {
  SingleAddToCartHandler,
  BulkAddToCartHandler,
  AddToCartHandler,
  CustomerTokenCallback,
} from '../src'

describe('TecsafeWidgetManager', () => {
  let mockTokenCallback: any
  let mockAddToCartCallback: any
  let mockConfig: WidgetManagerConfig

  beforeEach(() => {
    const testTokenBody = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })
    )
    const validTestToken = `header.${testTokenBody}.signature`

    mockTokenCallback = jest
      .fn<(oldToken?: string) => Promise<string>>()
      .mockResolvedValue(validTestToken)
    mockAddToCartCallback = jest
      .fn<() => Promise<boolean>>()
      .mockResolvedValue(true)
    mockConfig = {
      widgetBaseURL: 'https://test.tecsafe.com/widget',
      allowedOrigins: ['https://test.tecsafe.com'],
    } as WidgetManagerConfig

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
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
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
      new TecsafeWidgetManager(
        mockTokenCallback,
        mockAddToCartCallback,
        mockConfig
      )
    }).toThrow('The widgetBaseURL must be in the allowedOrigins list')
  })

  it('should resume browserId from localStorage if available', () => {
    window.localStorage.setItem('tecsafe-bid', 'existing-bid')
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
    expect(manager.getBrowserId()).toBe('existing-bid')
  })

  it('should create product detail widget', () => {
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
    const el = document.createElement('div')
    const widget = manager.createProductDetailWidget(el, 'test-article-123')
    expect(widget).toBeDefined()
    expect(manager.getWidgets()).toContain(widget)
  })

  it('should destroy all widgets', async () => {
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
    const cartEl = document.createElement('div')
    manager.createProductDetailWidget(cartEl, 'test-article-123')

    expect(manager.getWidgets().length).toBe(1)

    try {
      await (manager as any).saveToken('test')
    } catch (e) {}

    await manager.destroyAll()

    expect(manager.getWidgets().length).toBe(0)
  })

  it('should open and close full screen', () => {
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
    const appWidget = manager.getAppWidget()
    jest.spyOn(appWidget, 'setUrl').mockImplementation(() => {})
    jest.spyOn(appWidget, 'hide').mockImplementation(() => {})
    jest.spyOn(appWidget, 'destroy').mockImplementation(() => {})
    const sendSpy = jest.spyOn(manager, 'sendToAllWidgets')

    manager.openFullScreen('https://test.com')
    expect(appWidget.setUrl).toHaveBeenCalledWith('https://test.com')
    expect(sendSpy).toHaveBeenCalled()

    manager.closeFullScreen()
    expect(appWidget.hide).toHaveBeenCalled()

    manager.destroyFullScreen()
    expect(appWidget.destroy).toHaveBeenCalled()
  })

  it('should create custom page widget', () => {
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
    const el = document.createElement('div')
    const widget = manager.createCustomPageWidget(el)
    expect(widget).toBeDefined()
    expect(manager.getWidgets()).toContain(widget)
  })

  it('should test token methods', async () => {
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )

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
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
    await manager.getToken()
    expect(mockTokenCallback).toHaveBeenCalledWith('old-test-token')
  })

  it('should handle on/once/off properly', () => {
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
    const handler = jest.fn<any>()
    manager.on({ type: 'test' } as any, handler)
    manager.once({ type: 'test' } as any, handler)
    manager.off({ type: 'test' } as any, handler)
  })

  it('should handle emit and sendToAllWidgets properly', () => {
    const manager = new TecsafeWidgetManager(
      mockTokenCallback,
      mockAddToCartCallback,
      mockConfig
    )
    const spy = jest
      .spyOn(manager, 'sendToAllWidgets')
      .mockImplementation(() => {})
    manager.emit({ type: 'test', create: () => ({}) } as any, {})
    expect(spy).toHaveBeenCalled()
  })

  describe('add-to-cart handling', () => {
    const positions = [
      {
        linePosition: 1,
        articleNumber: 'ART-1',
        quantity: 2,
        configurationId: 'cfg-1',
      },
      { linePosition: 2, articleNumber: 'ART-2', quantity: 1 },
    ]

    const flushAsync = () => new Promise((resolve) => setTimeout(resolve, 0))

    it('registers the add-to-cart listener even without tecsafe url params', () => {
      const manager = new TecsafeWidgetManager(
        mockTokenCallback,
        mockAddToCartCallback,
        mockConfig
      )
      expect(manager.getMessageListeners()).toContain('add-to-cart')
    })

    it('calls the single handler per position and responds per position', async () => {
      const single = jest
        .fn<
          (
            articleNumber: string,
            quantity: number,
            configurationId?: string
          ) => Promise<boolean>
        >()
        .mockResolvedValue(true)
      const manager = new TecsafeWidgetManager(
        mockTokenCallback,
        { single },
        mockConfig
      )
      const widget = { sendMessage: jest.fn() } as any

      manager._triggerListeners(
        'add-to-cart',
        IN_MESSAGES.InMessageAddToCart.create({ positions }),
        widget
      )
      await flushAsync()

      expect(single).toHaveBeenCalledTimes(2)
      expect(single).toHaveBeenNthCalledWith(1, 'ART-1', 2, 'cfg-1')
      expect(single).toHaveBeenNthCalledWith(2, 'ART-2', 1, undefined)
      expect(widget.sendMessage).toHaveBeenCalledWith({
        type: 'added-to-cart',
        payload: { linePosition: 1, success: true },
      })
      expect(widget.sendMessage).toHaveBeenCalledWith({
        type: 'added-to-cart',
        payload: { linePosition: 2, success: true },
      })
    })

    it('calls the bulk handler once with all positions and responds per result', async () => {
      const bulk = jest
        .fn<
          (
            items: {
              linePosition: number
              articleNumber: string
              quantity: number
              configurationId?: string
            }[]
          ) => Promise<{ linePosition: number; success: boolean }[]>
        >()
        .mockResolvedValue([
          { linePosition: 1, success: true },
          { linePosition: 2, success: false },
        ])
      const manager = new TecsafeWidgetManager(
        mockTokenCallback,
        { bulk },
        mockConfig
      )
      const widget = { sendMessage: jest.fn() } as any

      manager._triggerListeners(
        'add-to-cart',
        IN_MESSAGES.InMessageAddToCart.create({ positions }),
        widget
      )
      await flushAsync()

      expect(bulk).toHaveBeenCalledTimes(1)
      expect(bulk).toHaveBeenCalledWith(positions)
      expect(widget.sendMessage).toHaveBeenCalledWith({
        type: 'added-to-cart',
        payload: { linePosition: 1, success: true },
      })
      expect(widget.sendMessage).toHaveBeenCalledWith({
        type: 'added-to-cart',
        payload: { linePosition: 2, success: false },
      })
    })

    it('exposes the handler types via the package entrypoint', () => {
      const single: SingleAddToCartHandler = { single: async () => true }
      const bulk: BulkAddToCartHandler = { bulk: async () => [] }
      const either: AddToCartHandler = single
      const tokenCb: CustomerTokenCallback = async () => 'token'
      expect('single' in either).toBe(true)
      expect(typeof bulk.bulk).toBe('function')
      expect(typeof tokenCb).toBe('function')
    })
  })
})
