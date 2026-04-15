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
  /**
   * The shops internal article number
   */
  articleNumber: string
  /**
   * Article info, null if not available
   */
  info: null | {
    /**
     * EAN (European Article Number) for the article
     */
    ean: string,
    /**
     * Name of the article
     */
    name: string,
    /**
     * Price of the article
     */
    price: string,
    /**
     * Stock of the article, if not provided the widget assumes there is unlimited stock.
     * If the stock is 0, the widget will display the article as out of stock.
     * Values < 0 are not allowed.
     */
    stock?: number,
    /**
     * Description of the article
     */
    description?: string,
    /**
     * SEO keywords for the article
     */
    seoKeywords?: string[],
    /**
     * Length in mm
     */
    lengthInMm?: number,
    /**
     * Width in mm
     */
    widthInMm?: number,
    /**
     * Height in mm
     */
    heightInMm?: number,
    /**
     * Weight in grams
     */
    weightInGrams?: number,
    /**
     * Product images
     */
    images?: URL[],
    /**
     * Media files, e.g. product videos
     */
    media?: URL[],
    /**
     * Alternative articles we can suggest to the customer, following the shop's internal article numbers
     */
    alternativeArticleNumbers?: string[],
  }
}>('article-info')
