import { defineMessage } from "../Contract";

/**
 * Outgoing message to notify the iframe that the full screen ui has been closed
 */
export const OutMessageFullScreenClosed = defineMessage<void>('full-screen-closed');
