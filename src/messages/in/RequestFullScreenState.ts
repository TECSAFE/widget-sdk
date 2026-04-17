import { defineMessage } from '../Contract'
import { OutMessageFullScreenOpened } from '../out/FullScreenOpened'
import { OutMessageFullScreenClosed } from '../out/FullScreenClosed'

/**
 * **The WidgetManager does handle this event under the hood by sending the FullScreenOpened or FullScreenClosed message.**
 * Incoming request from the iframe to receive the current full screen state.
 * @category InternalInMessage
 * @see {@link OutMessageFullScreenOpened}
 * @see {@link OutMessageFullScreenClosed}
 */
export const InMessageRequestFullScreenState = defineMessage<void>(
  'request-full-screen-state',
  (e, sdk) => {
    if (sdk.getAppWidget().isOpen()) {
      e.respond(OutMessageFullScreenOpened.create())
    } else {
      e.respond(OutMessageFullScreenClosed.create())
    }
  }
)
