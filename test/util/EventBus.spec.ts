import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { EventBus } from '../../src/util/EventBus'
import { MessageDefinition } from '../../src/messages/Contract'
import { BaseWidget } from '../../src/types/BaseWidget'

class TestEventBus extends EventBus {
  public triggerTest(type: string, payload: any, widget: BaseWidget) {
    this.trigger(type, payload, widget)
  }
}

describe('EventBus', () => {
  let eventBus: TestEventBus

  const mockMessage: MessageDefinition<any> = {
    type: 'test-message',
    create: jest.fn() as any,
  }

  const mockWidget = {} as BaseWidget

  beforeEach(() => {
    eventBus = new TestEventBus()
  })

  it('should register and trigger an event handler using "on"', () => {
    const handler = jest.fn()
    eventBus.on(mockMessage, handler)

    eventBus.triggerTest('test-message', { payload: 'data' }, mockWidget)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith({ payload: 'data' }, mockWidget)
  })

  it('should trigger an event handler only once using "once"', () => {
    const handler = jest.fn()
    eventBus.once(mockMessage, handler)

    eventBus.triggerTest('test-message', { payload: 'data' }, mockWidget)
    eventBus.triggerTest('test-message', { payload: 'data' }, mockWidget)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should remove an event handler using "off"', () => {
    const handler = jest.fn()
    eventBus.on(mockMessage, handler)
    eventBus.off(mockMessage, handler)

    eventBus.triggerTest('test-message', { payload: 'data' }, mockWidget)

    expect(handler).not.toHaveBeenCalled()
  })

  it('should not throw when removing an unregistered handler', () => {
    const handler = jest.fn()
    expect(() => {
      eventBus.off(mockMessage, handler)
    }).not.toThrow()
  })
})
