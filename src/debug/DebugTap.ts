import { MessageEnvelope } from '../types/MessageEnvelope'
import { IWidget } from '../types/Context'

/**
 * Which way a captured message travelled: `out` is SDK to widget, `in` is widget to SDK.
 * @category Internal
 */
export type DebugTapDirection = 'in' | 'out'

/**
 * A single captured message exchange between the SDK and one widget.
 * @category Internal
 */
export interface DebugTapEvent {
  /**
   * The widget the message was sent to, or received from
   */
  widget: IWidget
  /**
   * The direction the message travelled in
   */
  direction: DebugTapDirection
  /**
   * The message envelope as it went over postMessage
   */
  envelope: MessageEnvelope
}

/**
 * A listener that receives captured message exchanges.
 * @category Internal
 */
export type DebugTapListener = (event: DebugTapEvent) => void

/**
 * An internal, opt-in tap on the SDK's postMessage traffic. The widgets report every message
 * they send and receive here; nothing is captured or allocated unless a listener is
 * subscribed, which only happens when `sdkDebugger` is enabled in the configuration.
 * @category Internal
 */
export class DebugTap {
  private static listeners: DebugTapListener[] = []

  /**
   * Subscribes to captured message exchanges.
   * @param listener The listener to call for every captured message
   * @returns A function that removes the listener again
   */
  public static subscribe(listener: DebugTapListener): () => void {
    DebugTap.listeners.push(listener)
    return () => {
      const index = DebugTap.listeners.indexOf(listener)
      if (index !== -1) DebugTap.listeners.splice(index, 1)
    }
  }

  /**
   * Reports a message exchange to all subscribers. Returns immediately when nobody is
   * subscribed, and never lets a failing listener affect the caller.
   * @param widget The widget the message was sent to, or received from
   * @param direction The direction the message travelled in
   * @param envelope The message envelope as it went over postMessage
   */
  public static report(
    widget: IWidget,
    direction: DebugTapDirection,
    envelope: MessageEnvelope
  ): void {
    if (DebugTap.listeners.length === 0) return
    const event: DebugTapEvent = { widget, direction, envelope }
    for (const listener of [...DebugTap.listeners]) {
      try {
        listener(event)
      } catch {
        // A broken debug listener must never break the SDK.
      }
    }
  }
}
