import { BaseWidget } from './types/BaseWidget'
import { WidgetManagerConfig } from './types/WidgetManagerConfig'
import { MessageEnvelope } from './types/MessageEnvelope'
import { MessageDefinition, MessageEventHandler } from './messages/Contract'
import { OUT_MESSAGES, IN_MESSAGES } from './messages/Messages'
import { AppWidget } from './widget/AppWidget'
import { ProductDetailWidget } from './widget/ProductDetailWidget'
import { CustomPageWidget } from './widget/CustomPageWidget'
import { readUrlParams, clearUrlParams } from './util/UrlParamRW'
import { CustomerTokenCallback } from './types/CustomerTokenCallback'

import { EventBus } from './util/EventBus'
import { Logger } from './util/Logger'
import {
  AddToCartHandler,
  BulkAddToCartHandler,
  SingleAddToCartHandler,
} from './types/AddToCardHandler'

import { parseCustomerJwt } from './util/ParseCustomerJwt'

/**
 * The main entry point for the TECSAFE Widget SDK
 * @category SDK
 */
export class TecsafeWidgetManager extends EventBus {
  /**
   * The main entry point for the TECSAFE Widget SDK. This class should only be instantiated after
   * the user has consented to the terms, conditions, and privacy policy. The SDK will not ensure
   * GDPR complaince itself - this task is left for the implementor to intagrate into existing tools
   * and flows.
   * @param customerTokenCallback A function that returns the customer token as a string inside a
   *                              promise. It is expected that you implement a route in your
   *                              backend, using your own auth method to secure API communication,
   *                              and request a token from the TECSAFE API
   *                              [/jwt/saleschannel-customer](https://ofcp-api-gateway.staging.tecsafe.de/api#/Auth%20controller/AuthController_loginSaleschannelCustomer_v1).
   *                              This function handles initial as well as consecutive token
   *                              creation. If a previous token exists it must be handed in for
   *                              proper session upgrading.
   * @param addToCartCallback A function that adds product(s) to the cart. It is left tpo the
   * implementor to chose a single or bulk processing given their frameworks prerequisites. The
   * function will return a success status.
   * @param widgetManagerConfig The SDK configuration containing tracking and regional settings for
   * customer specific app optimization.
   * @throws An error if the configuration is invalid.
   */
  constructor(
    private readonly customerTokenCallback: CustomerTokenCallback,
    private readonly addToCartCallback: AddToCartHandler,
    private readonly widgetManagerConfig: WidgetManagerConfig
  ) {
    super()
    const url = new URL(widgetManagerConfig.widgetBaseURL)
    if (!widgetManagerConfig.allowedOrigins.includes(url.origin)) {
      throw new Error('The widgetBaseURL must be in the allowedOrigins list')
    }
    this.appWidget = new AppWidget(
      widgetManagerConfig,
      document.createElement('div'),
      this
    )
    // To don't make it to obvious thats a "browserID"
    // We shorten it to "bid"
    this.browserId = localStorage.getItem('tecsafe-bid')
    if (!this.browserId) {
      this.browserId = Math.random().toString(36).slice(2)
      localStorage.setItem('tecsafe-bid', this.browserId)
    }
    const params = readUrlParams()
    if (!params.browserId) return
    if (this.browserId !== params.browserId) {
      clearUrlParams()
      Logger.getInstance().warn('Browser ID mismatch, clearing URL params')
      return
    }
    try {
      this.openFullScreen(params.url)
    } catch (e) {
      Logger.getInstance().error('Failed to open full screen:', String(e))
    }

    this.on(IN_MESSAGES.InMessageAddToCart, async (e) => {
      const positions = e.event.positions
      if ('bulk' in this.addToCartCallback) {
        const results = await (
          this.addToCartCallback as BulkAddToCartHandler
        ).bulk(positions)
        results.forEach((result) => {
          e.respond(OUT_MESSAGES.OutMessageAddedToCart.create(result))
        })
      } else if ('single' in this.addToCartCallback) {
        const singleCb = this.addToCartCallback as SingleAddToCartHandler
        await Promise.all(
          positions.map(async (pos) => {
            const success = await singleCb.single(
              pos.articleNumber,
              pos.quantity,
              pos.configurationId
            )
            e.respond(
              OUT_MESSAGES.OutMessageAddedToCart.create({
                linePosition: pos.linePosition,
                success,
              })
            )
          })
        )
      }
    })
  }

  private browserId: string
  private widgets: BaseWidget[] = []
  private appWidget: AppWidget
  private token: string
  private tokenTimeout: number
  private tokenPromise: Promise<string> | null = null
  private refreshTimeoutId: number | null = null
  private fullScreenData: any

  public getBrowserId(): string {
    return this.browserId
  }

  /**
   * Opens the AppWidget in full screen mode on the provided url
   * @param url The url to open in full screen
   * @throws An error if the url is not in the allowedOrigins list
   * @see {@link AppWidget}
   */
  public openFullScreen(url: string): void {
    this.appWidget.setUrl(url)
    this.sendToAllWidgets(OUT_MESSAGES.OutMessageFullScreenOpened.create())
  }

  /**
   * Closes the AppWidget full screen mode
   * @see {@link AppWidget}
   */
  public closeFullScreen(): void {
    this.appWidget.hide()
    this.sendToAllWidgets(OUT_MESSAGES.OutMessageFullScreenClosed.create())
  }

  /**
   * Destroys the AppWidget full screen mode
   * @see {@link AppWidget}
   */
  public destroyFullScreen(): void {
    this.appWidget.destroy()
    this.sendToAllWidgets(OUT_MESSAGES.OutMessageFullScreenClosed.create())
  }

  /**
   * Sends a message to all widgets
   * @param message The message to send
   */
  /**
   * Sends a message to all widgets
   * @param message The message to send
   */
  public sendToAllWidgets(message: MessageEnvelope): void {
    for (const widget of this.widgets) widget.sendMessage(message as any)
    this.appWidget.sendMessage(message as any)
  }

  /**
   * Listens to a message from any widget
   * @param message The message definition
   * @param handler The handler to call when the message is received
   * @returns this
   */
  public override on<P>(
    message: MessageDefinition<P>,
    handler: MessageEventHandler<P>
  ): this {
    return super.on(message, handler)
  }

  /**
   * Listens to a message from any widget once
   * @param message The message definition
   * @param handler The handler to call when the message is received
   * @returns this
   */
  public override once<P>(
    message: MessageDefinition<P>,
    handler: MessageEventHandler<P>
  ): this {
    return super.once(message, handler)
  }

  /**
   * Stops listening to a message from any widget
   * @param message The message definition
   * @param handler The handler to remove
   * @returns this
   */
  public override off<P>(
    message: MessageDefinition<P>,
    handler: MessageEventHandler<P>
  ): this {
    return super.off(message, handler)
  }

  /**
   * Internal method to trigger listeners from a widget
   */
  public _triggerListeners(
    type: string,
    envelope: MessageEnvelope<any>,
    widget: BaseWidget
  ) {
    this.trigger(type, envelope, this, widget)
  }

  /**
   * Emits a message to all widgets
   * @param message The message definition
   * @param payload The payload to send
   * @returns this
   */
  public emit<P>(message: MessageDefinition<P>, payload: P): this {
    this.sendToAllWidgets(message.create(payload))
    return this
  }

  /**
   * The common method to save the token, and set the timeout for refreshing the token.
   * @param token The token to save
   * @returns A promise that resolves to the token again so the function can be chained
   */
  private async saveToken(token: string): Promise<string> {
    if (this.refreshTimeoutId) clearTimeout(this.refreshTimeoutId)
    this.token = token
    localStorage.setItem('tecsafe-token', token)
    const body = await parseCustomerJwt(this.token)
    if (!body) {
      Logger.getInstance().error(
        'Failed to parse token, is the tokenFN correctly implemented?'
      )
    }
    const in60s = Date.now() + 60_000
    this.tokenTimeout = body
      ? Math.max(body.exp * 1_000 - 60_000, in60s)
      : in60s
    this.refreshTimeoutId = window.setTimeout(
      () => this.refreshToken(),
      this.tokenTimeout - Date.now()
    )
    return token
  }

  /**
   * Gets the token, refreshing it if necessary.
   * Utilizes a cache to prevent multiple requests, and only refreshes the token if it is expired (or refresh is true).
   * @returns The token as a string inside a promise
   */
  public async getToken(refresh = false): Promise<string> {
    if (!refresh && this.tokenTimeout > Date.now()) return this.token
    if (this.tokenPromise) return this.tokenPromise
    const oldToken = localStorage.getItem('tecsafe-token') || undefined
    this.tokenPromise = this.customerTokenCallback(oldToken)
    const token = await this.saveToken(await this.tokenPromise)
    this.tokenPromise = null
    return token
  }

  /**
   * Refreshes the token and propagates it to all widget instances. If a customer's login status
   * changes you have to notify TECSAFE about that change. The customer token API will ensure that
   * guest assets will be transferred to registered accounts on login and that restigered customer
   * sessions will be cleaned appropriately for a new guest session.
   * @param token If provided, the token to use instead of fetching a new one with the tokenFN
   */
  public async refreshToken(token?: string | null): Promise<void> {
    if (token) await this.saveToken(token)
    else token = await this.getToken(true)
    this.sendToAllWidgets(OUT_MESSAGES.OutMessageSetToken.create({ token }))
  }

  /**
   * Destroys all widgets, and resets the SDK to its initial state
   */
  public async destroyAll(): Promise<void> {
    if (this.refreshTimeoutId) clearTimeout(this.refreshTimeoutId)
    this.refreshTimeoutId = null
    this.appWidget.destroy()
    for (const widget of this.widgets) widget.destroy()
    this.widgets = []
  }

  /**
   * Internal method to add a widget to the list of widgets, and show it
   * @param widget The widget to add
   * @returns The widget
   */
  private createWidget<T extends BaseWidget>(widget: T): T {
    this.widgets.push(widget)
    widget.show()
    return widget
  }

  /**
   * Creates a product detail widget.
   * @param el The element to attach the widget to
   * @param articleNumber The articleNumber of the respectively promoted article on the PDP. Make
   * sure to configure that article in TECSAFE's cockkpit to provide the necessary layout context.
   * TODO: @joschua: bitte extra parameter noch korrekt einbinden
   * @returns The product detail widget
   */
  public createProductDetailWidget(el: HTMLElement): ProductDetailWidget {
    return this.createWidget(
      new ProductDetailWidget(this.widgetManagerConfig, el, this)
    )
  }

  /**
   * Creates a custom page widget.
   * @param el The element to attach the widget to
   * @param contextId A custom contextID which needs to be references in TECSAFE's cockpit to
   * provide the necessary layout context. TODO: @joschua: bitte extra parameter noch korrekt
   * einbinden
   * @returns The custom page widget
   */
  public createCustomPageWidget(el: HTMLElement): CustomPageWidget {
    return this.createWidget(
      new CustomPageWidget(this.widgetManagerConfig, el, this)
    )
  }

  /**
   * Gets the app widget
   * @returns The app widget
   */
  public getAppWidget(): AppWidget {
    return this.appWidget
  }

  /**
   * Gets the config
   * @returns The config
   */
  public getConfig(): WidgetManagerConfig {
    return this.widgetManagerConfig
  }

  /**
   * Gets the widgets
   * @returns The widgets
   */
  public getWidgets(): BaseWidget[] {
    return this.widgets
  }

  /**
   * Gets the timestamp (in milliseconds) when the token will expire
   * @returns The timestamp when the token will expire
   */
  public getTokenTimeout(): number {
    return this.tokenTimeout
  }

  /**
   * Sets the full screen data. It is not recommended to use this method directly.
   * @param data The full screen data
   */
  public setFullScreenData(data: any): void {
    this.fullScreenData = data
  }

  /**
   * Gets the full screen data. It is not recommended to use this method directly.
   * @returns The full screen data
   */
  public getFullScreenData(): any {
    return this.fullScreenData
  }
}
