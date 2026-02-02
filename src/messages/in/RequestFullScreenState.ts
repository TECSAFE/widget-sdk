import { defineMessage } from "../Contract";
import { OutMessageFullScreenOpened } from "../out/FullScreenOpened";
import { OutMessageFullScreenClosed } from "../out/FullScreenClosed";

/**
 * Incoming request from the iframe to receive the current full screen state
 */
export const InMessageRequestFullScreenState = defineMessage<void>('request-full-screen-state', (e, sdk) => {
  if (sdk.getAppWidget().isOpen()) {
    e.respond(OutMessageFullScreenOpened.create());
  } else {
    e.respond(OutMessageFullScreenClosed.create());
  }
});
