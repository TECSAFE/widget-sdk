import { defineMessage } from "../Contract";

/**
 * Outgoing message to send the authentication token to the iframe
 */
export const OutMessageSetToken = defineMessage<string>('set-token');
