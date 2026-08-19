import { describe, it, expect, jest } from '@jest/globals'
import { DebugTap } from '../../src/debug/DebugTap'

const widget = {} as never

describe('DebugTap', () => {
  it('does nothing and allocates no event when nobody is subscribed', () => {
    expect(() =>
      DebugTap.report(widget, 'out', { type: 'a', payload: 1 })
    ).not.toThrow()
  })

  it('delivers reports to subscribers until they unsubscribe', () => {
    const seen: unknown[] = []
    const unsubscribe = DebugTap.subscribe((event) => seen.push(event))

    DebugTap.report(widget, 'out', { type: 'a', payload: 1 })
    DebugTap.report(widget, 'in', { type: 'b', payload: 2 })
    unsubscribe()
    DebugTap.report(widget, 'out', { type: 'c', payload: 3 })

    expect(seen).toEqual([
      { widget, direction: 'out', envelope: { type: 'a', payload: 1 } },
      { widget, direction: 'in', envelope: { type: 'b', payload: 2 } },
    ])
  })

  it('isolates a throwing listener from the caller and the other listeners', () => {
    const good = jest.fn()
    const offBad = DebugTap.subscribe(() => {
      throw new Error('boom')
    })
    const offGood = DebugTap.subscribe(good)

    expect(() =>
      DebugTap.report(widget, 'in', { type: 'a', payload: 1 })
    ).not.toThrow()
    expect(good).toHaveBeenCalledTimes(1)

    offBad()
    offGood()
  })

  it('tolerates unsubscribing twice', () => {
    const unsubscribe = DebugTap.subscribe(jest.fn())
    unsubscribe()
    expect(() => unsubscribe()).not.toThrow()
  })
})
