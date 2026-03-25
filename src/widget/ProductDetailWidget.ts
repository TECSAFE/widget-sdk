import { BaseWidget } from '../types/BaseWidget'

/**
 * A widget that promotes TECSAFE on a product detail page, or similar
 * @see {@link TecsafeWidgetManager}
 * @category Widget
 */
export class ProductDetailWidget extends BaseWidget {
  /**
   * @inheritdoc
   */
  protected readonly uiPath = 'product-detail'
}
