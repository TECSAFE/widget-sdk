import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood if a ping is received from an iframe.**
 * Outgoing pong and version exchange message from the SDK to the iframe widgets, responding to a ping.
 * @category OutMessage
 * @see {@link InMessagePing}
 */
export const OutMessagePong = defineMessage<{
  /**
   * The version of the SDK
   */
  version: string
}>('tecsafe-pong')
