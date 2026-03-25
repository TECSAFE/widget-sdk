import { defineMessage } from '../Contract'

/**
 * Outgoing message to send article info to the iframe.
 * If its not possible to get the article info, the event should still be send
 * with the info field set to null. The widget will then display the fallback
 * faster, and not wait for the timeout.
 * @category OutMessage
 * @see {@link InMessageRequestArticleInfo}
 */
export const OutMessageArticleInfo = defineMessage<{
  articleNumber: string
  info: null | {
    name: string
    price: string
  }
}>('article-info')
