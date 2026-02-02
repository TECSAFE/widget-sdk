import { defineMessage } from "../Contract";

/**
 * Incoming request from the iframe to change the height of the iframe
 */
export const InMessageSizeUpdate = defineMessage<number>('size-update', (e, sdk, widget) => {
  const iframe = widget.getIframe();
  if (iframe) {
    iframe.style.height = `${e.event}px`;
  }
});
