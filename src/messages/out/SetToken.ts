import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood if a request-token event is received from an iframe.**
 * Outgoing message to send the authentication token to the iframe.
 * @category OutMessage
 * @see {@link InMessageRequestToken}
 */
export const OutMessageSetToken = defineMessage<{ token: string }>('set-token')
