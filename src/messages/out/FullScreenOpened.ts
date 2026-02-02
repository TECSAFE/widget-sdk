import { defineMessage } from "../Contract";

/**
 * Outgoing message to notify the iframe that the full screen ui has been opened
 */
export const OutMessageFullScreenOpened = defineMessage<void>('full-screen-opened');
