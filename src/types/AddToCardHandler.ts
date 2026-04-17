/**
 * Handler for adding a single item to the cart. It assumes that TECSAFE layout articles as well as
 * saleschannel native articles can be handed over, e.g. when item-lists have been selected by
 * customer for upselling.
 */
export type SingleAddToCartHandler = {
  /**
   * Adds a single item to the cart.
   *
   * @param articleNumber - The article number of the product to add.
   * @param quantity - The quantity of the product to add.
   * @param configurationId - The configuration ID of the product to add, if not provided this is an up-selling and not a custom made product.
   * @returns A promise that resolves to true if the item was successfully added, false otherwise.
   * @see {@link InMessageAddToCart}
   * @see {@link OutMessageAddedToCart}
   * @see {@link BulkAddToCartHandler}
   * @see {@link AddToCartHandler}
   */
  single: (
    articleNumber: string,
    quantity: number,
    configurationId?: string
  ) => Promise<boolean>
}

/**
 * Handler for adding multiple items to the cart in bulk. It assumes that TECSAFE layout articles as
 * well as saleschannel native articles can be handed over, e.g. when item-lists have been selected
 * by customer for upselling.
 */
export type BulkAddToCartHandler = {
  /**
   * Adds multiple items to the cart in bulk.
   *
   * @param bulk - An array of items to add to the cart, specifying their target line position, article number, quantity, and optional configuration ID.
   * @returns A promise that resolves to an array of objects indicating the success status for each line position.
   * @see {@link InMessageAddToCart}
   * @see {@link OutMessageAddedToCart}
   * @see {@link SingleAddToCartHandler}
   * @see {@link AddToCartHandler}
   */
  bulk: (
    bulk: {
      linePosition: number
      articleNumber: string
      quantity: number
      configurationId?: string
    }[]
  ) => Promise<
    {
      linePosition: number
      success: boolean
    }[]
  >
}

/**
 * A handler that can process either single or bulk add-to-cart operations.
 */
export type AddToCartHandler = SingleAddToCartHandler | BulkAddToCartHandler
