import { defineMessage } from '../Contract'
import { BulkPosition } from '../../types/AddToCardHandler'

/**
 * **The WidgetManager does handle this event under the hood via the addToCart handler in the constructor.**
 * Incoming request from the iframe to add items to the cart.
 * @category InMessageInternal
 * @see {@link OutMessageAddedToCart}
 */
export const InMessageAddToCart = defineMessage<{
  positions: BulkPosition[]
}>('add-to-cart')
