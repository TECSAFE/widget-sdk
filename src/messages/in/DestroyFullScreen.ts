import { defineMessage } from "../Contract";

/**
 * Incoming request from the iframe to destroy the full screen ui (aka AppWidget)
 */
export const InMessageDestroyFullScreen = defineMessage<void>('destroy-full-screen', (e, sdk) => {
  sdk.closeFullScreen(true);
});
