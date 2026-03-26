import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { EventBus } from '../../src/util/EventBus'
import { MessageDefinition } from '../../src/messages/Contract'
import { BaseWidget } from '../../src/types/BaseWidget'

import { MessageEnvelope } from '../../src/types/MessageEnvelope'
import { ISDK, IWidget } from '../../src/types/Context'

class TestEventBus extends EventBus {
  public triggerTest(
    type: string,
    envelope: MessageEnvelope<any>,
    sdk: ISDK,
    widget: IWidget
  ) {
    this.trigger(type, envelope, sdk, widget)
  }
}

describe('EventBus', () => {
  let eventBus: TestEventBus

  const mockMessage: MessageDefinition<any> = {
    type: 'test-message',
    create: jest.fn() as any,
  }

  const mockSdk = {} as ISDK
  const mockWidget = {
    sendMessage: jest.fn(),
  } as unknown as IWidget

  beforeEach(() => {
    eventBus = new TestEventBus()
  })

  it('should register and trigger an event handler using "on"', () => {
    const handler = jest.fn<any>()
    eventBus.on(mockMessage, handler)

    eventBus.triggerTest(
      'test-message',
      { type: 'test-message', payload: 'data' },
      mockSdk,
      mockWidget
    )

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0]).toMatchObject({ event: 'data' })
    expect(handler.mock.calls[0][1]).toBe(mockSdk)
    expect(handler.mock.calls[0][2]).toBe(mockWidget)
  })

  it('should trigger an event handler only once using "once"', () => {
    const handler = jest.fn<any>()
    eventBus.once(mockMessage, handler)

    eventBus.triggerTest(
      'test-message',
      { type: 'test-message', payload: 'data' },
      mockSdk,
      mockWidget
    )
    eventBus.triggerTest(
      'test-message',
      { type: 'test-message', payload: 'data' },
      mockSdk,
      mockWidget
    )

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should remove an event handler using "off"', () => {
    const handler = jest.fn<any>()
    eventBus.on(mockMessage, handler)
    eventBus.off(mockMessage, handler)

    eventBus.triggerTest(
      'test-message',
      { type: 'test-message', payload: 'data' },
      mockSdk,
      mockWidget
    )

    expect(handler).not.toHaveBeenCalled()
  })

  it('should not throw when removing an unregistered handler', () => {
    const handler = jest.fn<any>()
    expect(() => {
      eventBus.off(mockMessage, handler)
    }).not.toThrow()
  })
})
