import { defineMessage } from '../Contract'
import { CartPunchoutRequest } from '../../types/CartPunchout'

/**
 * Requests transfer of the complete layout, its services and shop articles to the host cart.
 * Register a handler on the manager and respond with {@link OutMessageCartPunchoutResult}
 * after processing. Prices and taxes follow the session configuration.
 * @category InMessage
 */
export const InMessageCartPunchout = defineMessage<CartPunchoutRequest>(
  'cart-punchout',
  undefined,
  () => ({
    positions: [
      {
        positionId: 'example',
        parentPositionId: null,
        type: 'layout',
        identifiers: {
          hostShopArticleNumber: 'PA-100',
          supplierArticleNumber: 'LAY-123',
          manufacturerArticleNumber: null,
          gtin: null,
          itemID: 'example',
          itemCategory: 'layout',
          itemHash: 'example',
        },
        description: {
          title: { en: 'Foam inlay' },
          customerTitle: { en: 'Hammer layout' },
          description: { en: null },
        },
        quantity: {
          relation: 'independent',
          value: '1',
          total: '1',
          unitOfMeasure: 'PCE',
        },
        pricing: {
          unitPrice: '50.00',
          allowancesAndCharges: [],
          effectiveUnitPrice: '50.00',
          lineAmount: '50.00',
        },
        taxCategory: 'S',
        meta: {
          material: {
            quality: 'LD45',
            depthInMm: '30',
            widthInMm: '600',
            heightInMm: '300',
            layerColors: [{ hexColor: '#000000', name: { en: 'Black' } }],
          },
          thumbnailURL: 'https://example.com/thumbnail.png',
          imageURL: 'https://example.com/image.png',
          itemCount: { tools: 30, Freeform: 5, Laser: 10, Grip: 2 },
        },
      },
    ],
    tecsafeTotal: 50,
  })
)
