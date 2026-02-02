import { defineMessage } from "../Contract";

/**
 * Outgoing message to send the meta data to the iframe
 */
export const OutMessageMetaSendData = defineMessage<{
  /**
   * The list of events the parent has registered listeners for
   */
  registeredEvents: string[];
}>('meta-send-data');
