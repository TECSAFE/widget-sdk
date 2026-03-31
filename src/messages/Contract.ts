import { ISDK, IWidget } from '../types/Context'
import { MessageEnvelope } from '../types/MessageEnvelope'

/**
 * The event passed to the message handler.
 * @template P The type of the payload
 */
export interface WidgetMessageEvent<P> {
  event: P
  respond: (msg: MessageEnvelope) => void
}

/**
 * The handler for a event message.
 * **Please note that the sdk and widget passed are in their interface base form, which may not have all the methods available.**
 * **Use a local variable to store the sdk and widget in their extended form if you need to access the additional methods.**
 * @example
 * ```typescript
 * const sdk = new TecsafeWidgetSDK();
 * sdk.on(InMessagePing, (e) => { // explicitly don't use `(e, sdk, widget)` here, to use the local variable
 *   console.log(e.event, sdk);
 *   // if you need to respond to the message, you can still use e.respond()
 *   e.respond(OutMessagePong.create({} as any))
 * })
 */
export type MessageEventHandler<P> = (
  event: WidgetMessageEvent<P>,
  sdk: ISDK,
  widget: IWidget
) => void | Promise<void>

/**
 * A message definition, used to define a message that can be sent or received.
 * @template P The type of the payload
 */
export type MessageDefinition<P> = {
  type: string
  create: (payload: P) => MessageEnvelope<P>
  defaultHandler?: MessageEventHandler<P>
}

/**
 * Creates a message definition.
 * @param type The type of the message
 * @param defaultHandler The default handler for the message
 * @returns A message definition
 */
export function defineMessage<P>(
  type: string,
  defaultHandler?: MessageEventHandler<P>
): MessageDefinition<P> {
  return {
    type,
    create: (payload: P) => ({ type, payload }),
    defaultHandler,
  }
}
