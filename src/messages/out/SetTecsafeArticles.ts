import { defineMessage } from '../Contract'
import { TecsafeArticle } from '../../types/WidgetManagerConfig'

/**
 * Outgoing message to send the shop's TECSAFE article list to the iframe.
 * Sent automatically in response to a {@link InMessageRequestTecsafeArticles},
 * carrying the {@link WidgetManagerConfig.tecsafeArticles} of the widget manager.
 * @category OutMessage
 * @see {@link InMessageRequestTecsafeArticles}
 */
export const OutMessageSetTecsafeArticles = defineMessage<{
  /**
   * The TECSAFE articles listed by the shop
   */
  articles: TecsafeArticle[]
}>('set-tecsafe-articles')
