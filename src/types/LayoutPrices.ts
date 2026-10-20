import { LocalizedText, PriceScale, TaxCategory, UnitPricing } from './Pricing'

/** TECSAFE service supplied for customer-specific price conversion. */
export type TecsafeServicePriceRequest = UnitPricing & {
  serviceId: string
  serviceTitle: LocalizedText
  serviceCategory: string
  isMandatory: boolean
  taxCategory: TaxCategory
}

/**
 * Incoming TECSAFE layout prices. Values are always net prices in EUR and may contain
 * TECSAFE allowances and charges. Convert them for the current shop customer.
 */
export type LayoutPricesRequest = {
  requestId: string
  layout: {
    priceScales: PriceScale[]
    taxCategory: TaxCategory
  }
  tecsafeServices: TecsafeServicePriceRequest[]
}

/**
 * Customer-specific prices in the session's currency and gross/net mode.
 * Preserve requestId and serviceId so the widget can correlate the response.
 * Preserve TECSAFE allowances and charges and include any shop adjustments.
 * Tax categories, when supplied, refer to the session configuration.
 */
export type LayoutPricesSuccessResponse = {
  requestId: string
  /** Omitted by existing integrations; both absence and true indicate success. */
  success?: true
  error?: never
  layout: {
    priceScales: PriceScale[]
    taxCategory?: TaxCategory
  }
  tecsafeServices: (UnitPricing & {
    serviceId: string
    taxCategory?: TaxCategory
  })[]
}

/** Pricing could not be calculated. Echo requestId and omit all price data. */
export type LayoutPricesFailureResponse = {
  requestId: string
  success: false
  /** Optional human-readable failure message suitable for the customer. */
  error?: string
  layout?: never
  tecsafeServices?: never
}

/** Check success === false before reading layout or service prices. */
export type LayoutPricesResponse =
  | LayoutPricesSuccessResponse
  | LayoutPricesFailureResponse
