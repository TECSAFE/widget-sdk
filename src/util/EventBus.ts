import { OutMessageEnvelope } from 'src/messages/Messages'
import { MessageDefinition, MessageEventHandler } from '../messages/Contract'
import { MessageEnvelope } from 'src/types/MessageEnvelope'
import { ISDK, IWidget } from 'src/types/Context'

/**
 * A simple event bus that can be extended by other classes
 * to provide event-driven functionality.
 * It strictly handles messages defined via MessageDefinition.
 */
export abstract class EventBus {
  protected listeners: Map<string, MessageEventHandler<any>[]> = new Map()

  /**
   * Listens to a message
   * @param message The message definition
   * @param handler The handler to call when the message is received
   * @returns this
   */
  public on<P>(
    message: MessageDefinition<P>,
    handler: MessageEventHandler<P>
  ): this {
    if (!this.listeners.has(message.type)) {
      this.listeners.set(message.type, [])
    }
    this.listeners.get(message.type)?.push(handler)
    return this
  }

  /**
   * Listens to a message once
   * @param message The message definition
   * @param handler The handler to call when the message is received
   * @returns this
   */
  public once<P>(
    message: MessageDefinition<P>,
    handler: MessageEventHandler<P>
  ): this {
    const onceHandler: MessageEventHandler<P> = (event, sdk, widget) => {
      this.off(message, onceHandler)
      handler(event, sdk, widget)
    }
    return this.on(message, onceHandler)
  }

  /**
   * Stops listening to a message
   * @param message The message definition
   * @param handler The handler to remove
   * @returns this
   */
  public off<P>(
    message: MessageDefinition<P>,
    handler: MessageEventHandler<P>
  ): this {
    const listeners = this.listeners.get(message.type)
    if (listeners) {
      const index = listeners.indexOf(handler)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
    return this
  }

  /**
   * Triggers all listeners for a given message type
   * @param type The message type
   * @param envelope The message envelope containing the payload
   * @param sdk The SDK instance
   * @param widget The widget instance
   */
  protected trigger(
    type: string,
    envelope: MessageEnvelope<any>,
    sdk: ISDK,
    widget: IWidget
  ): void {
    const listeners = this.listeners.get(type)
    if (listeners)
      for (const listener of listeners) {
        listener(
          {
            event: envelope.payload,
            respond: (message) => widget.sendMessage(message),
          },
          sdk,
          widget
        )
      }
  }

  /**
   * Gets the list of message types that have listeners registered
   * @returns The list of message types
   */
  public getMessageListeners(): string[] {
    return Array.from(this.listeners.keys())
  }
}
