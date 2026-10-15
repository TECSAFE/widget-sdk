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
export type LayoutPricesResponse = {
  requestId: string
  layout: {
    priceScales: PriceScale[]
    taxCategory?: TaxCategory
  }
  tecsafeServices: (UnitPricing & {
    serviceId: string
    taxCategory?: TaxCategory
  })[]
}
