import { SDK_VERSION } from '../../util/Version'
import { defineMessage } from '../Contract'
import { OutMessagePong } from '../out/Pong'

/**
 * **The WidgetManager does handle this event under the hood by sending the Pong message.**
 * Incoming ping and version exchange message from the iframe widgets to the SDK
 * @category InternalInMessage
 * @see {@link OutMessagePong}
 */
export const InMessagePing = defineMessage<{
  /**
   * The version of the Widget
   */
  version: string
}>('tecsafe-ping', (e) => {
  e.respond(OutMessagePong.create({ version: SDK_VERSION }))
})
