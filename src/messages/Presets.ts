import { IN_MESSAGES, OUT_MESSAGES } from './Messages'

/**
 * An example payload for every message the SDK can send or receive, keyed by the message type
 * as it appears on the wire (`MessageDefinition.type`). Messages without a payload map to
 * `null`. Use it to prefill debug tooling, documentation snippets or integration test
 * fixtures - the values are illustrative placeholders, not real data.
 * @example
 * ```typescript
 * import { MESSAGE_PRESETS, OUT_MESSAGES } from '@tecsafe/widget-sdk'
 *
 * const example = MESSAGE_PRESETS[OUT_MESSAGES.OutMessageSetToken.type]
 * // => { token: 'example' }
 * ```
 * @category SDK
 */
export const MESSAGE_PRESETS: Record<string, unknown> = {
  [IN_MESSAGES.InMessageAddToCart.type]: {
    positions: [
      {
        linePosition: 0,
        articleNumber: 'example',
        quantity: 1,
        configurationId: 'example',
      },
    ],
  },
  [IN_MESSAGES.InMessagePing.type]: {
    version: 'example',
  },
  [IN_MESSAGES.InMessageRequestToken.type]: null,
  [IN_MESSAGES.InMessageOpenFullScreen.type]: {
    url: 'https://example.com',
  },
  [IN_MESSAGES.InMessageCloseFullScreen.type]: null,
  [IN_MESSAGES.InMessageDestroyFullScreen.type]: null,
  [IN_MESSAGES.InMessageSizeUpdate.type]: {
    height: 0,
  },
  [IN_MESSAGES.InMessageRequestFullScreenState.type]: null,
  [IN_MESSAGES.InMessageRequestMetaData.type]: null,
  [IN_MESSAGES.InMessageRequestArticleInfo.type]: {
    articleNumber: 'example',
  },
  [OUT_MESSAGES.OutMessagePong.type]: {
    version: 'example',
  },
  [OUT_MESSAGES.OutMessageContextId.type]: {
    contextId: 'example',
  },
  [OUT_MESSAGES.OutMessageSetToken.type]: {
    token: 'example',
  },
  [OUT_MESSAGES.OutMessageFullScreenOpened.type]: null,
  [OUT_MESSAGES.OutMessageFullScreenClosed.type]: null,
  [OUT_MESSAGES.OutMessageSetMetaData.type]: {
    registeredEvents: ['example'],
  },
  [OUT_MESSAGES.OutMessageArticleInfo.type]: {
    articleNumber: 'example',
    info: {
      ean: 'example',
      name: 'example',
      price: '9.99',
      stock: 0,
      description: 'example',
      seoKeywords: ['example'],
      lengthInMm: 0,
      widthInMm: 0,
      heightInMm: 0,
      weightInGrams: 0,
      images: ['https://example.com'],
      media: ['https://example.com'],
      alternativeArticleNumbers: ['example'],
    },
  },
  [OUT_MESSAGES.OutMessageAddedToCart.type]: {
    linePosition: 0,
    success: true,
  },
}
