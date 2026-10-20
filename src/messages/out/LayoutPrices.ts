import { defineMessage } from '../Contract'
import { LayoutPricesResponse } from '../../types/LayoutPrices'

/**
 * Customer-specific layout and service prices. Echo the requestId and serviceIds.
 * Prices and taxes follow the session configuration. If pricing fails, echo requestId
 * with success: false and an optional error message, omitting all price data.
 * @category OutMessage
 * @see {@link InMessageRequestLayoutPrices}
 */
export const OutMessageLayoutPrices = defineMessage<LayoutPricesResponse>(
  'layout-prices',
  undefined,
  () => ({
    requestId: 'example',
    success: true,
    layout: {
      priceScales: [
        {
          fromQuantity: 1,
          unitPrice: '47.50',
          allowancesAndCharges: [],
          effectiveUnitPrice: '47.50',
        },
      ],
    },
    tecsafeServices: [
      {
        serviceId: 'programming',
        unitPrice: '10.00',
        allowancesAndCharges: [],
        effectiveUnitPrice: '10.00',
      },
    ],
  })
)
