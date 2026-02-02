import { defineMessage } from "../Contract";

/**
 * Outgoing pong and version exchange message from the SDK to the iframe widgets, responding to a ping
 */
export const OutMessagePong = defineMessage<{
  version: string;
}>('ofcp-pong');
