import { defineMessage } from '../Contract'

/**
 * Incoming request from the iframe to get article info.
 * If subscribed it is expected that a {@link OutMessageArticleInfo} is send back.
 * @example
 * ```ts
 * sdk.on(InMessageRequestArticleInfo, (e) => {
 *   e.respond(OutMessageArticleInfo.create({
 *     articleNumber: e.event.articleNumber,
 *     info: {
 *       name: 'Article Name',
 *       price: '100',
 *     },
 *   }))
 * })
 * ```
 * @category InMessage
 * @see {@link OutMessageArticleInfo}
 */
export const InMessageRequestArticleInfo = defineMessage<{
  articleNumber: string
}>('request-article-info')
