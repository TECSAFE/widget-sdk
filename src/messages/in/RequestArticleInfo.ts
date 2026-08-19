import { defineMessage } from '../Contract'

/**
 * Incoming request from the iframe to get article info about a list of articles.
 * If subscribed it is expected that a {@link OutMessageArticleInfo} is send back.
 * @example
 * ```ts
 * sdk.on(InMessageRequestArticleInfo, (e) => {
 *   for (const article of e.event.articles) {
 *     // fetch article info from your database
 *     const a = await fetchMyShopArticleInfo(article.ean, article.manufacturerArticleNumber)
 *     e.respond(OutMessageArticleInfo.create({
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
  articles: (
    | {
        ean: string
        manufacturerArticleNumber: string
      }
    | {
        ean: string
      }
    | {
        manufacturerArticleNumber: string
      }
  )[]
}>('request-article-info')
