import { describe, it, expect } from '@jest/globals'
import { IN_MESSAGES, OUT_MESSAGES } from '../../src/messages/Messages'
import type { ArticleIdentifier } from '../../src'

describe('business event contracts', () => {
  it('accepts GTIN, manufacturer and supplier article identifiers', () => {
    const articles: ArticleIdentifier[] = [
      { gtin: '04012345678901' },
      { manufacturerArticleNumber: 'M-1' },
      { supplierArticleNumber: 'S-1' },
      {
        gtin: '04012345678901',
        manufacturerArticleNumber: 'M-1',
        supplierArticleNumber: 'S-1',
      },
    ]
    // @ts-expect-error At least one article identifier is required.
    const empty: ArticleIdentifier = {}
    expect(
      IN_MESSAGES.InMessageRequestArticleInfo.create({ articles }).payload
        .articles
    ).toEqual(articles)
  })

  it('echoes article identifiers with the revised info or a null fallback', () => {
    const article = { supplierArticleNumber: 'S-1' }
    const priceScales = [
      {
        fromQuantity: 1,
        unitPrice: '38.50',
        allowancesAndCharges: [
          {
            reasonText: 'Summer-Rebate',
            type: 'percentage' as const,
            value: '5',
          },
        ],
        effectiveUnitPrice: '36.58',
      },
    ]
    const info = {
      hostShopArticleNumber: 'HOST-1',
      availableStock: true,
      taxCategory: 'AA',
      priceScales,
      images: ['https://shop.example/image.png'],
      downloads: ['https://shop.example/manual.pdf'],
    }
    expect(
      OUT_MESSAGES.OutMessageArticleInfo.create({ article, info })
    ).toEqual({ type: 'article-info', payload: { article, info } })
    expect(
      OUT_MESSAGES.OutMessageArticleInfo.create({ article, info: null }).payload
        .info
    ).toBeNull()
  })

  it('correlates layout price responses and permits different response service fields', () => {
    const priceScales = [
      {
        fromQuantity: 1,
        unitPrice: '50.00',
        allowancesAndCharges: [],
        effectiveUnitPrice: '50.00',
      },
    ]
    const request = IN_MESSAGES.InMessageRequestLayoutPrices.create({
      requestId: 'req-1',
      layout: { priceScales, taxCategory: 'S' },
      tecsafeServices: [
        {
          serviceId: 'programming',
          serviceTitle: { de: 'Programmierung' },
          serviceCategory: 'programming',
          unitPrice: '10.00',
          allowancesAndCharges: [],
          effectiveUnitPrice: '10.00',
          isMandatory: true,
          taxCategory: 'S',
        },
      ],
    })
    const response = OUT_MESSAGES.OutMessageLayoutPrices.create({
      requestId: request.payload.requestId,
      layout: { priceScales },
      tecsafeServices: [
        {
          serviceId: 'programming',
          unitPrice: '10.00',
          allowancesAndCharges: [],
          effectiveUnitPrice: '10.00',
        },
      ],
    })
    expect(request.type).toBe('request-layout-prices')
    expect(response.type).toBe('layout-prices')
    expect(response.payload.requestId).toBe('req-1')
    expect(JSON.parse(JSON.stringify(response))).toEqual(response)
  })

  it('provides complete punchout presets and an ordinary success/failure response', () => {
    const payload = IN_MESSAGES.InMessageCartPunchout.preset()!
    expect(payload.positions[0]).toMatchObject({
      positionId: expect.any(String),
      parentPositionId: null,
      type: 'layout',
      identifiers: { hostShopArticleNumber: expect.any(String) },
      quantity: {
        relation: 'independent',
        value: '1',
        total: '1',
        unitOfMeasure: 'PCE',
      },
      pricing: {
        unitPrice: expect.any(String),
        effectiveUnitPrice: expect.any(String),
        lineAmount: expect.any(String),
      },
      taxCategory: 'S',
    })
    expect(
      OUT_MESSAGES.OutMessageCartPunchoutResult.create({ success: false })
    ).toEqual({ type: 'cart-punchout-result', payload: { success: false } })
  })
})
