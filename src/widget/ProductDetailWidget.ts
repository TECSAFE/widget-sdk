import { WidgetManagerConfig } from '../types/WidgetManagerConfig'
import { BaseWidget } from '../types/BaseWidget'
import { TecsafeWidgetManager } from '../TecsafeWidgetSDK'
import { InMessagePing } from '../messages/in/Ping'
import { OutMessageContextId } from '../messages/out/ContextId'

/**
 * A widget that promotes the TECSAFE Layout configurator on a product detail page, or similar
 * product related page. Use when a clear product context exists, usually a container vessel for foam
 * layouts.
 * @see {@link TecsafeWidgetManager}
 * @category Widget
 */
export class ProductDetailWidget extends BaseWidget {
  /**
   * Creates a new ProductDetailPageWidget, not recommended to use directly, use the widget manager instead
   * @see {@link TecsafeWidgetManager.createProductDetailWidget}
   * @param config The widget manager configuration
   * @param el The element to attach the widget to
   * @param api The widget manager API
   * @param articleNumber The article number of the product
   */
  constructor(
    protected readonly config: WidgetManagerConfig,
    protected el: HTMLElement,
    protected readonly api: TecsafeWidgetManager,
    protected readonly articleNumber: string
  ) {
    super(config, el, api)
    this.on(InMessagePing, (e) => {
      e.respond(OutMessageContextId.create({ contextId: this.articleNumber }))
    })
  }

  /**
   * @inheritdoc
   */
  protected readonly uiPath = 'product-detail'
}
