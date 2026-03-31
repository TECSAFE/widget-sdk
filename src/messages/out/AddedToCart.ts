import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood via the addToCart handler in the constructor.**
 * Outgoing message from the iframe to notify the WidgetManager that items have been added to the cart.
 * @category OutMessage
 * @see {@link InMessageAddToCart}
 */
export const OutMessageAddedToCart = defineMessage<{
  /**
   * The line position of the product, should be the same as the line position of the InMessageAddToCart event.
   */
  linePosition: number
  /**
   * The success status of the add to cart operation
   */
  success: boolean
}>('added-to-cart')
