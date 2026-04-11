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
  info: null | {  //TODO: @joschua bitte nochmal syntax korrigieren und erweitern
    EAN: string,
    name: string,
    description?: string,
    seoKeywords?: string[],
    price: string,
    priceTaxIncluded: boolean,
    lengthInMm?: number,
    widthInMm?: number,
    heightInMm?: number,
    weightInGrams?: number,
    images?: URL[],
    media?: URL[],
    alternatives?: <articleNumber>[],
  }
}>('article-info')
