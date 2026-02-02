import { defineMessage } from "../Contract";

/**
 * Incoming request from the iframe to close the full screen
 */
export const InMessageCloseFullScreen = defineMessage<void>('close-full-screen', (e, sdk) => {
  sdk.closeFullScreen();
});
