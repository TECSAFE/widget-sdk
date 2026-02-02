import { defineMessage } from "../Contract";
import { OutMessageSetToken } from "../out/SetToken";

/**
 * Incoming request from the iframe to receive the authentication token
 */
export const InMessageRequestToken = defineMessage<void>('request-token', async (e, sdk) => {
  e.respond(OutMessageSetToken.create(await sdk.getToken()));
});
