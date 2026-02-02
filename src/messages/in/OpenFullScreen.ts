import { defineMessage } from "../Contract";

/**
 * Incoming request from the iframe to open a path in full screen
 */
export const InMessageOpenFullScreen = defineMessage<string>('open-full-screen', (e, sdk) => {
  sdk.openFullScreen(e.event);
});
