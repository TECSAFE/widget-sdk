/**
 * Identifies an article by GTIN, manufacturer article number, or supplier article number.
 * At least one identifier must be present. Echo the complete identifier in article-info responses.
 */
export type ArticleIdentifier = {
  gtin?: string
  manufacturerArticleNumber?: string
  supplierArticleNumber?: string
} & (
  | { gtin: string }
  | { manufacturerArticleNumber: string }
  | { supplierArticleNumber: string }
)
