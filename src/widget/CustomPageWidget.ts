import { BaseWidget } from '../types/BaseWidget'

/**
 * A widget that promotes the TECSAFE Layout configurator on a custom page, e.g. a blog post,
 * landing page, etc. Use when a no clear prodct contect exists - which is usually the case for
 * generic demos or custom foam configurations.
 * @see {@link TecsafeWidgetManager}
 * @category Widget
 */
export class CustomPageWidget extends BaseWidget {
  /**
   * @inheritdoc
   */
  protected readonly uiPath = 'custom-page'
}
