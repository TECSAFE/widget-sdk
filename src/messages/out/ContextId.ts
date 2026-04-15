import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood if a ping is received from an iframe.**
 * Outgoing context id message from the SDK to the iframe widgets, as an additional response to a ping if a context id is available.
 * @category OutMessage
 * @see {@link InMessagePing}
 */
export const OutMessageContextId = defineMessage<{
  /**
   * The context id
   */
  contextId: string
}>('context-id')
