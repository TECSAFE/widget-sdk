/**
 * A callback function that returns the customer token.
 * @param oldToken - The old token, if available.
 * @returns A promise that resolves to the customer token.
 */
export type CustomerTokenCallback = (oldToken?: string) => Promise<string>
