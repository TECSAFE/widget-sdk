import { defineMessage } from '../Contract'
import { BulkPositionAnswer } from '../../types/AddToCardHandler'

/**
 * **The WidgetManager does handle this event under the hood via the addToCart handler in the constructor.**
 * Outgoing message from the iframe to notify the WidgetManager that items have been added to the cart.
 * @category OutMessage
 * @see {@link InMessageAddToCart}
 */
export const OutMessageAddedToCart = defineMessage<{
  positions: BulkPositionAnswer[]
}>('added-to-cart')
