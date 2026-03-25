import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood by opening the AppWidget.**
 * Incoming request from the iframe to open a path in full screen.
 * @category InMessageInternal
 * @see {@link AppWidget}
 * @see {@link OutMessageFullScreenOpened}
 */
export const InMessageOpenFullScreen = defineMessage<{
  url: string
}>('open-full-screen', (e, sdk) => {
  sdk.openFullScreen(e.event.url)
})
