import { WidgetManagerConfig } from '../types/WidgetManagerConfig'
import { BaseWidget } from '../types/BaseWidget'
import { TecsafeWidgetManager } from '../TecsafeWidgetSDK'
import { InMessagePing } from '../messages/in/Ping'
import { OutMessageContextId } from '../messages/out/ContextId'

/**
 * A widget that promotes the TECSAFE Layout configurator on a custom page, e.g. a blog post,
 * landing page, etc. Use when a no clear product context exists - which is usually the case for
 * generic demos or custom foam configurations.
 * @see {@link TecsafeWidgetManager}
 * @category Widget
 */
export class CustomPageWidget extends BaseWidget {
  /**
   * Creates a new ProductDetailPageWidget, not recommended to use directly, use the widget manager instead
   * @see {@link TecsafeWidgetManager.createProductDetailWidget}
   * @param config The widget manager configuration
   * @param el The element to attach the widget to
   * @param api The widget manager API
   * @param contextId The context ID of the custom page, if not provided, the widget will show a generic start page
   */
  constructor(
    protected readonly config: WidgetManagerConfig,
    protected el: HTMLElement,
    protected readonly api: TecsafeWidgetManager,
    protected readonly contextId?: string,
  ) {
    super(config, el, api)
    if (this.contextId) this.on(InMessagePing, (e) => {
      e.respond(OutMessageContextId.create({ contextId: this.contextId }))
    })
  }

  /**
   * @inheritdoc
   */
  protected readonly uiPath = 'custom-page'
}
