import { describe, it, expect } from '@jest/globals'
import { IN_MESSAGES, OUT_MESSAGES } from '../../src/messages/Messages'

describe('message presets', () => {
  it('has a preset function for every incoming and outgoing message', () => {
    for (const message of [
      ...Object.values(IN_MESSAGES),
      ...Object.values(OUT_MESSAGES),
    ]) {
      expect(message.preset).toEqual(expect.any(Function))
    }
  })

  it('returns JSON-serialisable payloads', () => {
    for (const message of [
      ...Object.values(IN_MESSAGES),
      ...Object.values(OUT_MESSAGES),
    ]) {
      expect(() =>
        JSON.stringify({ type: message.type, payload: message.preset() })
      ).not.toThrow()
    }
  })

  it('maps payload-less messages to null', () => {
    expect(IN_MESSAGES.InMessageRequestToken.preset()).toBeNull()
    expect(OUT_MESSAGES.OutMessageFullScreenOpened.preset()).toBeNull()
  })
})
