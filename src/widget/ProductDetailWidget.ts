import { BaseWidget } from '../types/BaseWidget'

/**
 * A widget that promotes the TECSAFE Layout configurator on a product detail page, or similar
 * product related page. Use when a clear prodct contect exists, usually a container vessel for foam
 * layouts.
 * @see {@link TecsafeWidgetManager}
 * @category Widget
 */
export class ProductDetailWidget extends BaseWidget {
  /**
   * @inheritdoc
   */
  protected readonly uiPath = 'product-detail'
}
