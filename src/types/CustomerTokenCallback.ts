/**
 * A callback function that returns the customer token as a string inside a promise. It is expected
 * that you implement a route in your backend, using your own auth method to secure API
 * communication, and request a token from the TECSAFE API
 * [/jwt/saleschannel-customer](https://ofcp-api-gateway.staging.tecsafe.de/api#/Auth%20controller/AuthController_loginSaleschannelCustomer_v1).
 * This function handles initial as well as consecutive token creation. If a previous token exists
 * it must be handed in for proper session upgrading.
 * @param oldToken - The old token, if available.
 * @returns A promise that resolves to the customer token.
 */
export type CustomerTokenCallback = (oldToken?: string) => Promise<string>
