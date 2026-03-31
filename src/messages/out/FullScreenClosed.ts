import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood on AppWidget state change.**
 * Outgoing message to notify the iframe that the full screen ui has been closed.
 * @category OutMessage
 * @see {@link InMessageRequestFullScreenState}
 * @see {@link InMessageCloseFullScreen}
 * @see {@link InMessageDestroyFullScreen}
 */
export const OutMessageFullScreenClosed =
  defineMessage<void>('full-screen-closed')
