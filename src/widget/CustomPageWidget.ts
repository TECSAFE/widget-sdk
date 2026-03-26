import { BaseWidget } from '../types/BaseWidget'

/**
 * A widget that promotes TECSAFE on a custom page, e.g. a blog post, landing page, etc.
 * @see {@link TecsafeWidgetManager}
 * @category Widget
 */
export class CustomPageWidget extends BaseWidget {
  /**
   * @inheritdoc
   */
  protected readonly uiPath = 'custom-page'
}
