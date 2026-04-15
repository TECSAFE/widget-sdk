/**
 * A message envelope used to send messages between the widget and the SDK
 */
export interface MessageEnvelope<P = any> {
  type: string
  payload: P
}
