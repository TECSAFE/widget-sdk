import { defineMessage } from '../Contract'
import { ArticleIdentifier } from '../../types/ArticleIdentifier'
import { ArticleInfo } from '../../types/ArticleInfo'

/**
 * Shop details for a requested article, using the session's currency, price mode and taxes.
 * Echo the requested article identifier verbatim. Send info: null when unavailable
 * so the widget can display its fallback without waiting for a timeout.
 * @category OutMessage
 * @see {@link InMessageRequestArticleInfo}
 */
export const OutMessageArticleInfo = defineMessage<{
  article: ArticleIdentifier
  info: ArticleInfo | null
}>('article-info', undefined, () => ({
  article: {
    gtin: '04012345678901',
    manufacturerArticleNumber: 'example',
    supplierArticleNumber: 'example',
  },
  info: {
    hostShopArticleNumber: 'example',
    availableStock: true,
    taxCategory: 'AA',
    priceScales: [
      {
        fromQuantity: 1,
        unitPrice: '38.50',
        allowancesAndCharges: [
          { reasonText: 'Summer-Rebate', type: 'percentage', value: '5' },
        ],
        effectiveUnitPrice: '36.58',
      },
    ],
    images: ['https://example.com/image.png'],
    downloads: ['https://example.com/manual.pdf'],
  },
}))
