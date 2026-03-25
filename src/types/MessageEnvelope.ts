export interface MessageEnvelope<P = any> {
  type: string
  payload: P
}
