import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood via the addToCart handler in the constructor.**
 * Incoming request from the iframe to add items to the cart.
 * @category InternalInMessage
 * @see {@link OutMessageAddedToCart}
 */
export const InMessageAddToCart = defineMessage<{
  /**
   * The positions to add to the cart
   */
  positions: {
    /**
     * The line position of the product in the cart, relevant to for the response to map the results.
     * Can be used add items to the cart in the same line order as the widget is displaying them.
     */
    linePosition: number
    /**
     * The article number of the product.
     */
    articleNumber: string
    /**
     * The quantity of the product.
     */
    quantity: number
    /**
     * The configuration id of the product, if not provided, the target is an up-selling product.
     */
    configurationId?: string
  }[]
}>('add-to-cart')
