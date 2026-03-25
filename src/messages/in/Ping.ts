import { SDK_VERSION } from '../../util/Version'
import { defineMessage, type MessageDefinition } from '../Contract'
import { OutMessagePong } from '../out/Pong'

/**
 * **The WidgetManager does handle this event under the hood by sending the Pong message.**
 * Incoming ping and version exchange message from the iframe widgets to the SDK
 * @category InMessageInternal
 * @see {@link OutMessagePong}
 */
export const InMessagePing = defineMessage<{
  version: string
}>('tecsafe-ping', (e) => {
  e.respond(OutMessagePong.create({ version: SDK_VERSION }))
})
