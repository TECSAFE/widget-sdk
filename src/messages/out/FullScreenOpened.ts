import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood on AppWidget state change.**
 * Outgoing message to notify the iframe that the full screen ui has been opened.
 * @category OutMessage
 * @see {@link InMessageRequestFullScreenState}
 * @see {@link InMessageOpenFullScreen}
 */
export const OutMessageFullScreenOpened =
  defineMessage<void>('full-screen-opened')
