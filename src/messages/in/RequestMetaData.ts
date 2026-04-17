import { defineMessage } from '../Contract'
import { OutMessageSetMetaData } from '../out/SetMetaData'

/**
 * **The WidgetManager does handle this event under the hood by sending the SetMetaData message.**
 * Incoming message to request meta data from the SDK.
 * @category InternalInMessage
 * @see {@link OutMessageSetMetaData}
 */
export const InMessageRequestMetaData = defineMessage<void>(
  'request-meta-data',
  (e, sdk, widget) => {
    const globalMessages = sdk.getMessageListeners()
    const widgetMessages = widget.getMessageListeners()

    const allEvents = Array.from(
      new Set([...globalMessages, ...widgetMessages])
    )

    e.respond(
      OutMessageSetMetaData.create({
        registeredEvents: allEvents,
      })
    )
  }
)
