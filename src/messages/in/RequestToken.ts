import { defineMessage } from '../Contract'
import { OutMessageSetToken } from '../out/SetToken'

/**
 * **The WidgetManager does handle this event under the hood by sending the SetToken message.**
 * Incoming request from the iframe to receive the authentication token.
 * @category InternalInMessage
 * @see {@link OutMessageSetToken}
 */
export const InMessageRequestToken = defineMessage<void>(
  'request-token',
  async (e, sdk) => {
    e.respond(OutMessageSetToken.create({ token: await sdk.getToken() }))
  }
)
