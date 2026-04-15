import { InMessagePing } from './in/Ping'
import { InMessageRequestToken } from './in/RequestToken'
import { InMessageOpenFullScreen } from './in/OpenFullScreen'
import { InMessageCloseFullScreen } from './in/CloseFullScreen'
import { InMessageDestroyFullScreen } from './in/DestroyFullScreen'
import { InMessageSizeUpdate } from './in/SizeUpdate'
import { InMessageRequestFullScreenState } from './in/RequestFullScreenState'
import { InMessageRequestMetaData } from './in/RequestMetaData'

import { OutMessagePong } from './out/Pong'
import { OutMessageSetToken } from './out/SetToken'
import { OutMessageFullScreenOpened } from './out/FullScreenOpened'
import { OutMessageFullScreenClosed } from './out/FullScreenClosed'
import { OutMessageSetMetaData } from './out/SetMetaData'

import type { MessageDefinition } from './Contract'
import { InMessageAddToCart } from './in/AddToCart'
import { OutMessageArticleInfo } from './out/ArticleInfo'
import { InMessageRequestArticleInfo } from './in/RequestArticleInfo'
import { OutMessageAddedToCart } from './out/AddedToCart'
import { OutMessageContextId } from './out/ContextId'

/**
 * Helper type to strip the import type from a message definition.
 */
export type StripImport<T> = T extends {
  type: string
  create: (payload: infer P) => any
}
  ? MessageDefinition<P>
  : T

/**
 * Helper type to map over a type and strip the import type from each message definition.
 */
export type MapStripImport<T> = {
  [K in keyof T]: StripImport<T[K]>
}

/**
 * The map of all incoming messages
 * @category MessageMap
 */
export const _IN_MESSAGES = {
  InMessageAddToCart,
  InMessagePing,
  InMessageRequestToken,
  InMessageOpenFullScreen,
  InMessageCloseFullScreen,
  InMessageDestroyFullScreen,
  InMessageSizeUpdate,
  InMessageRequestFullScreenState,
  InMessageRequestMetaData,
  InMessageRequestArticleInfo,
}

/**
 * The map of all outgoing messages
 * @category MessageMap
 */
export const _OUT_MESSAGES = {
  OutMessagePong,
  OutMessageContextId,
  OutMessageSetToken,
  OutMessageFullScreenOpened,
  OutMessageFullScreenClosed,
  OutMessageSetMetaData,
  OutMessageArticleInfo,
  OutMessageAddedToCart,
}

/**
 * Re-export to resolve compiler quirks.
 * @see _IN_MESSAGES
 * @category MessageMap
 */
export const IN_MESSAGES: MapStripImport<typeof _IN_MESSAGES> = _IN_MESSAGES

/**
 * Re-export to resolve compiler quirks.
 * @see _OUT_MESSAGES
 * @category MessageMap
 */
export const OUT_MESSAGES: MapStripImport<typeof _OUT_MESSAGES> = _OUT_MESSAGES

/**
 * The type of all incoming messages
 * @category MessageMap
 */
export type InMessage = (typeof IN_MESSAGES)[keyof typeof IN_MESSAGES]

/**
 * The type of all outgoing messages
 * @category MessageMap
 */
export type OutMessage = (typeof OUT_MESSAGES)[keyof typeof OUT_MESSAGES]

/**
 * The type of all incoming message envelopes
 * @category MessageMap
 */
export type InMessageEnvelope = ReturnType<InMessage['create']>

/**
 * The type of all outgoing message envelopes
 * @category MessageMap
 */
export type OutMessageEnvelope = ReturnType<OutMessage['create']>
