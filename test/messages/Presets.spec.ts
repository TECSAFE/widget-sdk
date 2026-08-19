import { describe, it, expect } from '@jest/globals'
import { IN_MESSAGES, OUT_MESSAGES } from '../../src/messages/Messages'
import { MESSAGE_PRESETS } from '../../src/messages/Presets'

const allTypes = [
  ...Object.values(IN_MESSAGES).map((m) => m.type),
  ...Object.values(OUT_MESSAGES).map((m) => m.type),
]

describe('MESSAGE_PRESETS', () => {
  it('has an entry for every incoming and outgoing message type', () => {
    for (const type of allTypes) {
      expect(Object.keys(MESSAGE_PRESETS)).toContain(type)
    }
  })

  it('has no entry that is not a known message type', () => {
    expect(Object.keys(MESSAGE_PRESETS).sort()).toEqual([...allTypes].sort())
  })

  it('is JSON serialisable so it can seed a debug textarea', () => {
    for (const [type, payload] of Object.entries(MESSAGE_PRESETS)) {
      expect(() => JSON.stringify({ type, payload })).not.toThrow()
    }
  })

  it('maps payload-less messages to null', () => {
    expect(MESSAGE_PRESETS[IN_MESSAGES.InMessageRequestToken.type]).toBeNull()
    expect(
      MESSAGE_PRESETS[OUT_MESSAGES.OutMessageFullScreenOpened.type]
    ).toBeNull()
  })
})
