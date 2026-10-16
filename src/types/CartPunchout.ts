import { LocalizedText, TaxCategory, UnitPricing } from './Pricing'

/** Genuine article identifiers and TECSAFE item references for a punchout position. */
export type CartPunchoutIdentifiers = {
  hostShopArticleNumber?: string | null
  supplierArticleNumber?: string | null
  manufacturerArticleNumber?: string | null
  gtin?: string | null
  itemID?: string | null
  itemCategory?: string | null
  itemHash?: string | null
}

/** Optional position metadata, with room for service- and article-specific properties. */
export type CartPunchoutMeta = {
  material?: {
    quality: string
    depthInMm: string
    widthInMm: string
    heightInMm: string
    layerColors: { hexColor: string; name: LocalizedText }[]
  }
  thumbnailURL?: string
  imageURL?: string
  itemCount?: Record<string, number>
  [key: string]: unknown
}

/** A layout, service, or shop article transferred to the host cart. */
export type CartPunchoutPosition = {
  /** Opaque position identifier minted by TECSAFE. */
  positionId: string
  /** Null for the layout; otherwise the parent layout's positionId. */
  parentPositionId: string | null
  type: 'layout' | 'tecsafeService' | 'hostShopArticle'
  identifiers: CartPunchoutIdentifiers
  description: {
    title: LocalizedText
    customerTitle?: LocalizedText
    description?: Record<string, string | null>
  }
  quantity: {
    relation: 'per-parent-unit' | 'once-per-parent' | 'independent'
    value: string
    /** Quantity derived from the parent relation. */
    total: string
    /** UN/ECE Recommendation 20 code, e.g. PCE. */
    unitOfMeasure: string
  }
  pricing: UnitPricing & { lineAmount: string }
  taxCategory: TaxCategory
  meta?: CartPunchoutMeta
}

/** All positions transferred together, with TECSAFE's total in the session currency. */
export type CartPunchoutRequest = {
  positions: CartPunchoutPosition[]
  tecsafeTotal: number
}

/** Report success only after the host cart accepted the complete punchout. */
export type CartPunchoutResult = {
  success: boolean
}
