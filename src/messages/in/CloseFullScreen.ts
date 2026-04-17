import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood by closing the AppWidget.**
 * Incoming request from the iframe to close the full screen.
 * @category InternalInMessage
 * @see {@link AppWidget}
 * @see {@link OutMessageFullScreenClosed}
 */
export const InMessageCloseFullScreen = defineMessage<void>(
  'close-full-screen',
  (e, sdk) => {
    sdk.closeFullScreen()
  }
)
