import { defineMessage } from '../Contract'
import { ArticleIdentifier } from '../../types/ArticleIdentifier'

/**
 * Incoming request from the iframe to get article info about a list of articles.
 * If subscribed it is expected that a {@link OutMessageArticleInfo} is send back
 * per requested article, echoing the requested {@link ArticleIdentifier} in the
 * `article` field so the widget can correlate the response.
 * @example
 * ```ts
 * sdk.on(InMessageRequestArticleInfo, (e) => {
 *   for (const article of e.event.articles) {
 *     // fetch article info from your database
 *     const a = await fetchMyShopArticleInfo(article.ean, article.manufacturerArticleNumber)
 *     e.respond(OutMessageArticleInfo.create({
 *       article,
 *       articleNumber: a.articleNumber,
 *       info: {
 *         name: a.name,
 *         price: a.price,
 *       },
 *     }))
 *   }
 * })
 * ```
 * @category InMessage
 * @see {@link OutMessageArticleInfo}
 */
export const InMessageRequestArticleInfo = defineMessage<{
  articles: ArticleIdentifier[]
}>('request-article-info', undefined, () => ({
  articles: [
    {
      ean: 'example',
      manufacturerArticleNumber: 'example',
    },
  ],
}))
