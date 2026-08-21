import { defineMessage } from '../Contract'
import { OutMessageSetTecsafeArticles } from '../out/SetTecsafeArticles'

/**
 * **The WidgetManager does handle this event under the hood by sending the SetTecsafeArticles message.**
 * Incoming request from the iframe to receive the shop's TECSAFE article list
 * as configured in {@link WidgetManagerConfig.tecsafeArticles}.
 * @category InternalInMessage
 * @see {@link OutMessageSetTecsafeArticles}
 */
export const InMessageRequestTecsafeArticles = defineMessage<void>(
  'request-tecsafe-articles',
  async (e, sdk) => {
    e.respond(
      OutMessageSetTecsafeArticles.create({
        articles: sdk.getConfig().tecsafeArticles,
      })
    )
  },
  () => null
)
