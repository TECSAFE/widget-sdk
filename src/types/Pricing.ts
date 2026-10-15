/** A discount or surcharge applied to a unit price. Monetary values are decimal strings. */
export type AllowanceOrCharge = {
  reasonText: string
  type: 'percentage'
  value: string
}

/** Pricing before and after allowances and charges, in the session's price mode and currency. */
export type UnitPricing = {
  unitPrice: string
  allowancesAndCharges: AllowanceOrCharge[]
  effectiveUnitPrice: string
}

/** A unit price applicable from the specified quantity onward. */
export type PriceScale = UnitPricing & {
  fromQuantity: number
}

/** Tax category code configured in the session, including shop-specific categories. */
export type TaxCategory = string

/** Text keyed by language tag from the session configuration. */
export type LocalizedText = Record<string, string>
