import { SDK_VERSION } from "../../util/Version";
import { defineMessage } from "../Contract";
import { OutMessagePong } from "../out/Pong";

/**
 * Incoming ping and version exchange message from the iframe widgets to the SDK
 */
export const InMessagePing = defineMessage<{
  version: string;
}>('ofcp-ping', (e) => {
  e.respond(OutMessagePong.create({ version: SDK_VERSION }));
});
