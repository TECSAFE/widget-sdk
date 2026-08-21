import { defineMessage } from '../Contract'
import { TecsafeArticle } from '../../types/TecsafeArticle'

/**
 * Outgoing message to send the shop's TECSAFE article list to the iframe.
 * Sent automatically in response to a {@link InMessageRequestTecsafeArticles},
 * carrying the {@link WidgetManagerConfig.tecsafeArticles} of the widget manager.
 * @category InternalOutMessage
 * @see {@link InMessageRequestTecsafeArticles}
 */
export const OutMessageSetTecsafeArticles = defineMessage<{
  /**
   * The TECSAFE articles listed by the shop
   */
  articles: TecsafeArticle[]
}>('set-tecsafe-articles', undefined, () => ({
  articles: [
    {
      productNumber: 'example',
      price: '9.99',
    },
  ],
}))
