import { Logger } from './Logger'

/**
 * Parses the customer JWT token
 * @param token The customer JWT token
 * @returns The payload of the customer JWT token, or null if the token is invalid
 */
export const parseCustomerJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) throw new Error('Invalid token structure')
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch (e) {
    Logger.getInstance().error('Failed to parse customer JWT', String(e))
    return null
  }
}
