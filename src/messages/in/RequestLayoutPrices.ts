import { defineMessage } from '../Contract'
import { LayoutPricesRequest } from '../../types/LayoutPrices'

/**
 * Requests customer-specific layout and service prices. Incoming prices are net EUR;
 * respond in the currency and price mode of the session configuration. Always reply,
 * including success: false and the original requestId when prices cannot be calculated.
 * @category InMessage
 * @see {@link OutMessageLayoutPrices}
 */
export const InMessageRequestLayoutPrices = defineMessage<LayoutPricesRequest>(
  'request-layout-prices',
  undefined,
  () => ({
    requestId: 'example',
    layout: {
      priceScales: [
        {
          fromQuantity: 1,
          unitPrice: '50.00',
          allowancesAndCharges: [],
          effectiveUnitPrice: '50.00',
        },
      ],
      taxCategory: 'S',
    },
    tecsafeServices: [
      {
        serviceId: 'programming',
        serviceTitle: { en: 'Programming' },
        serviceCategory: 'programming',
        unitPrice: '10.00',
        allowancesAndCharges: [],
        effectiveUnitPrice: '10.00',
        isMandatory: true,
        taxCategory: 'S',
      },
    ],
  })
)
