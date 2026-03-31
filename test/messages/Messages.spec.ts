import { describe, it, expect } from '@jest/globals'
import { IN_MESSAGES, OUT_MESSAGES } from '../../src/messages/Messages'
import { readdirSync } from 'fs'
import { join } from 'path'

describe('Messages', () => {
  describe('IN_MESSAGES', () => {
    it('should define incoming messages', () => {
      expect(Object.keys(IN_MESSAGES).length).toBeGreaterThan(0)
      for (const value of Object.values(IN_MESSAGES)) {
        expect(value).toBeDefined()
        expect(value.type).toBeDefined()
      }
    })

    it('should create message with payload', () => {
      for (const value of Object.values(IN_MESSAGES)) {
        const msg = value.create(undefined as never)
        expect(msg.type).toBe(value.type)
        expect(msg.payload).toBeUndefined()
      }
    })

    it('should not be missing any message', () => {
      const files = readdirSync(
        join(__dirname, '..', '..', 'src', 'messages', 'in')
      )
      const messages = Object.keys(IN_MESSAGES).sort()
      expect(messages).toEqual(
        files.map((file) => 'InMessage' + file.substring(0, file.length - 3))
      )
    })
  })

  describe('OUT_MESSAGES', () => {
    it('should define outgoing messages', () => {
      expect(Object.keys(OUT_MESSAGES).length).toBeGreaterThan(0)
      for (const value of Object.values(OUT_MESSAGES)) {
        expect(value).toBeDefined()
        expect(value.type).toBeDefined()
      }
    })

    it('should create outgoing message with payload correctly', () => {
      for (const value of Object.values(OUT_MESSAGES)) {
        const msg = value.create(undefined as never)
        expect(msg.type).toBe(value.type)
        expect(msg.payload).toBeUndefined()
      }
    })

    it('should not be missing any message', () => {
      const files = readdirSync(
        join(__dirname, '..', '..', 'src', 'messages', 'out')
      )
      const messages = Object.keys(OUT_MESSAGES).sort()
      expect(messages).toEqual(
        files
          .map((file) => 'OutMessage' + file.substring(0, file.length - 3))
          .sort()
      )
    })
  })
})
