import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood by destroying the AppWidget.**
 * Incoming request from the iframe to destroy the full screen ui (aka AppWidget).
 * @category InternalInMessage
 * @see {@link AppWidget}
 * @see {@link OutMessageFullScreenClosed}
 */
export const InMessageDestroyFullScreen = defineMessage<void>(
  'destroy-full-screen',
  (e, sdk) => {
    sdk.destroyFullScreen()
  }
)
