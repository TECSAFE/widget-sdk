import { defineMessage } from '../Contract'

/**
 * **The WidgetManager does handle this event under the hood by resizing the iframe.**
 * Incoming request from the iframe to change the height of the iframe.
 * @category InternalInMessage
 */
export const InMessageSizeUpdate = defineMessage<{
  /**
   * The height of the iframe requested by the widget in pixels
   */
  height: number
}>(
  'size-update',
  (e, sdk, widget) => {
    const iframe = widget.getIframe()
    if (iframe) iframe.style.height = `${e.event.height}px`
    else throw new Error('Iframe not found')
  }
)
