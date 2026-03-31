import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood if a request-meta-data event is received from an iframe.**
 * Outgoing message to send the meta data to the iframe.
 * @category OutMessage
 * @see {@link InMessageRequestMetaData}
 */
export const OutMessageSetMetaData = defineMessage<{
  /**
   * The list of events the parent has registered listeners for
   */
  registeredEvents: string[]
}>('set-meta-data')
