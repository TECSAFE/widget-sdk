import { defineMessage } from '../Contract'
import { ArticleIdentifier } from '../../types/ArticleIdentifier'

/**
 * Requests shop details for the supplied articles. Respond with one
 * {@link OutMessageArticleInfo} per article, echoing the complete identifier.
 * Respond with info: null if an article cannot be found.
 * Prices and taxes must follow the session configuration. Hosts should rate-limit
 * their article lookup API as appropriate.
 * @category InMessage
 * @see {@link OutMessageArticleInfo}
 */
export const InMessageRequestArticleInfo = defineMessage<{
  articles: ArticleIdentifier[]
}>('request-article-info', undefined, () => ({
  articles: [
    {
      gtin: '04012345678901',
      manufacturerArticleNumber: 'example',
      supplierArticleNumber: 'example',
    },
  ],
}))
