import { PriceScale, TaxCategory } from './Pricing'

/** Shop article details. Prices and taxes follow the session configuration. */
export type ArticleInfo = {
  /** The shop's internal article number, used for cart punchout. */
  hostShopArticleNumber: string
  /** Omit when stock availability is unknown. */
  availableStock?: boolean
  taxCategory: TaxCategory
  priceScales: PriceScale[]
  /** Absolute image URL strings, serializable via postMessage/JSON. */
  images?: string[]
  /** Absolute download URL strings. */
  downloads?: string[]
}
