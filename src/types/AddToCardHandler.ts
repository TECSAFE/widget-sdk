/**
 * Represents a single position in a bulk add-to-cart operation.
 */
export type BulkPosition = {
  linePosition: number
  articleNumber: string
  quantity: number
  configurationId?: string
}

/**
 * Represents the answer for a single position in a bulk add-to-cart operation.
 */
export type BulkPositionAnswer = {
  linePosition: number
  success: boolean
}

/**
 * Handler for adding a single item to the cart.
 */
export type SingleAddToCartHandler = {
  /**
   * Adds a single item to the cart.
   *
   * @param articleNumber - The article number of the product to add.
   * @param quantity - The number of items to add.
   * @param configurationId - Optional configuration ID for customized products.
   * @returns A promise that resolves to true if the item was successfully added, false otherwise.
   */
  single: (
    articleNumber: string,
    quantity: number,
    configurationId?: string
  ) => Promise<boolean>
}

/**
 * Handler for adding multiple items to the cart in bulk.
 */
export type BulkAddToCartHandler = {
  /**
   * Adds multiple items to the cart in bulk.
   *
   * @param bulk - An array of items to add to the cart, specifying their target line position, article number, quantity, and optional configuration ID.
   * @returns A promise that resolves to an array of objects indicating the success status for each line position.
   */
  bulk: (bulk: BulkPosition[]) => Promise<BulkPositionAnswer[]>
}

/**
 * A handler that can process either single or bulk add-to-cart operations.
 */
export type AddToCartHandler = SingleAddToCartHandler | BulkAddToCartHandler
