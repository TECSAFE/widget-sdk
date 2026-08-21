/**
 * Identifies an article by EAN and/or manufacturer article number.
 * At least one of the two identifiers is always present.
 * @category Internal
 */
export type ArticleIdentifier =
  | {
      ean: string
      manufacturerArticleNumber: string
    }
  | {
      ean: string
    }
  | {
      manufacturerArticleNumber: string
    }
