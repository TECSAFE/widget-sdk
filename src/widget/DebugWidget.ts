import { BaseWidget } from '../types/BaseWidget'

/**
 * A widget that renders the TECSAFE debug console, an iframe UI that shows the widget side of
 * the SDK message exchange and can send arbitrary messages back to the SDK. Use it while
 * integrating the SDK to confirm that messages arrive as expected; it is not meant for
 * production pages.
 * @see {@link TecsafeWidgetManager.createDebugWidget}
 * @category Widget
 */
export class DebugWidget extends BaseWidget {
  /**
   * @inheritdoc
   */
  protected override readonly uiPath = 'debug'
}
