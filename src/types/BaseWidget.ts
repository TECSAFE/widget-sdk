import { TecsafeWidgetManager } from '../TecsafeWidgetSDK'
import { WidgetManagerConfig } from './WidgetManagerConfig'
import { MessageDefinition, WidgetMessageEvent } from '../messages/Contract'
import { IN_MESSAGES, OUT_MESSAGES, OutMessageEnvelope } from '../messages/Messages'
import { MessageEnvelope } from './MessageEnvelope'

import { EventBus } from '../util/EventBus'
import { IWidget } from './Context'

/**
 * Base class for all widgets, providing common functionality
 */
export class BaseWidget extends EventBus implements IWidget {
  constructor(
    protected readonly config: WidgetManagerConfig,
    protected el: HTMLElement,
    protected readonly api: TecsafeWidgetManager
  ) {
    super()
    window.addEventListener('message', this.onMessage.bind(this))
  }

  /**
   * The iframe element
   */
  protected iframe: HTMLIFrameElement | null = null

  /**
   * The path to the iframe which will be appended to the uiBaseURL to get the full URL
   */
  protected readonly uiPath: string = 'iframe'

  /**
   * Sends a message to the iframe
   * @param message The message to send
   * @returns void
   */
  public sendMessage(message: OutMessageEnvelope): void {
    if (!this.iframe) return
    const iframeSrc = new URL(this.iframe.src)
    const origin = iframeSrc.origin
    if (!this.config.allowedOrigins.includes(origin)) {
      console.error(
        '[TECSAFE] Widget',
        this.el,
        'cannot send message to origin',
        origin
      )
      return
    }
    this.iframe.contentWindow?.postMessage(message, origin)
  }

  /**
   * Handles messages from the iframe
   * @param event The message event
   * @returns void
   * @see {@link BaseWidget.onMessageExtended}
   */
  private async onMessage(event: MessageEvent): Promise<void> {
    if (!this.iframe) return
    if (!this.config.allowedOrigins.includes(event.origin)) return
    if (event.source !== this.iframe.contentWindow) return
    if (typeof event.data !== 'object') return
    if (!event.data.type) return

    const respond = (msg: MessageEnvelope) => this.sendMessage(msg)

    for (const msgDef of Object.values(
      IN_MESSAGES
    ) as MessageDefinition<any>[]) {
      if (msgDef.type === event.data.type) {
        if (msgDef.defaultHandler) {
          await msgDef.defaultHandler(
            { event: event.data.payload, respond },
            this.api,
            this
          )
        }

        this.trigger(event.data.type, event.data.payload)

        this.api._triggerListeners(event.data.type, event.data.payload, this)
        return
      }
    }
  }

  /**
   * Shows the widget, creating it if necessary
   * @returns void
   * @see {@link BaseWidget.preShow} {@link BaseWidget.preCreate} {@link BaseWidget.postCreate} {@link BaseWidget.postShow}
   */
  public show(): void {
    this.preShow()
    if (this.iframe) {
      this.iframe.style.display = 'block'
      this.postShow()
      return
    }
    this.preCreate()
    this.iframe = document.createElement('iframe')
    this.iframe.src = `${this.config.widgetBaseURL}/${this.uiPath}`
    const s = this.iframe.style
    s.width = '100%'
    s.height = '0px'
    s.backgroundColor = 'transparent'
    s.border = 'none'
    s.transition = this.config.iframeTransition
    // this.iframe.setAttribute('allow', 'camera') // Maybe needed for the editor
    this.iframe.setAttribute('allowtransparency', 'true')
    this.el.appendChild(this.iframe)
    this.postCreate()
    this.postShow()
  }

  /**
   * Returns whether the widget is open or not
   * @returns True if the widget is open, false otherwise
   */
  public isOpen(): boolean {
    if (!this.iframe) return false
    return this.iframe.style.display !== 'none'
  }

  /**
   * Gets the iframe element
   * @returns The iframe element or null if it doesn't exist currently
   */
  public getIframe(): HTMLIFrameElement | null {
    return this.iframe
  }

  /**
   * Destroys the widget
   * @returns void
   * @see {@link BaseWidget.preDestroy}
   * @see {@link BaseWidget.postDestroy}
   */
  public destroy(): void {
    if (!this.iframe) return
    this.preDestroy()
    this.el.innerHTML = ''
    this.iframe = null
    this.postDestroy()
  }

  /**
   * Hides the widget, without destroying it
   * @returns void
   */
  /**
   * Listens to a message from the iframe
   * @param message The message definition
   * @param handler The handler to call when the message is received
   * @returns this
   */
  public override on<P>(
    message: MessageDefinition<P>,
    handler: (payload: P) => void
  ): this {
    return super.on(message, handler)
  }

  /**
   * Listens to a message from the iframe once
   * @param message The message definition
   * @param handler The handler to call when the message is received
   * @returns this
   */
  public override once<P>(
    message: MessageDefinition<P>,
    handler: (payload: P) => void
  ): this {
    return super.once(message, handler)
  }

  /**
   * Stops listening to a message from the iframe
   * @param message The message definition
   * @param handler The handler to remove
   * @returns this
   */
  public override off<P>(
    message: MessageDefinition<P>,
    handler: (payload: P) => void
  ): this {
    return super.off(message, handler)
  }

  /**
   * Emits a message to the iframe
   * @param message The message definition
   * @param payload The payload to send
   * @returns this
   */
  public emit<P>(message: MessageDefinition<P>, payload: P): this {
    if (!(Object.values(OUT_MESSAGES).map(m => m.type).includes(message.type)))
      throw new Error('Only outgoing messages can be emitted')
    this.sendMessage(message.create(payload) as OutMessageEnvelope)
    return this
  }

  /**
   * Hides the widget, without destroying it
   * @returns void
   */
  public hide(): void {
    if (!this.iframe) return
    this.preHide()
    this.iframe.style.display = 'none'
    this.postHide()
  }

  /**
   * Lifecycle hooks for extending classes
   * @param event The message event
   * @returns Promise<boolean> Whether the message was handled
   * @see {@link BaseWidget.onMessage}
   */
  protected async onMessageExtended(
    event: WidgetMessageEvent<any>
  ): Promise<boolean> {
    return false
  }

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.show}
   */
  protected preShow(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.show}
   */
  protected postShow(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.show}
   */
  protected preCreate(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.show}
   */
  protected postCreate(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.destroy}
   */
  protected preDestroy(): void {}

  /**
   * Lifecycle hook for extending classes
   * @see {@link BaseWidget.destroy}
   */
  protected postDestroy(): void {}

  /**
   * Lifecycle hook for extending classes
   */
  protected preHide(): void {}

  /**
   * Lifecycle hook for extending classes
   */
  protected postHide(): void {}
}
