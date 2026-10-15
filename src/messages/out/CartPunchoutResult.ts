import { defineMessage } from '../Contract'
import { CartPunchoutResult } from '../../types/CartPunchout'

/**
 * Reports whether the host cart accepted the complete punchout.
 * Send via the request's respond() method. On failure the widget can retain the
 * layout and let the customer retry.
 * @category OutMessage
 * @see {@link InMessageCartPunchout}
 */
export const OutMessageCartPunchoutResult = defineMessage<CartPunchoutResult>(
  'cart-punchout-result',
  undefined,
  () => ({ success: true })
)
