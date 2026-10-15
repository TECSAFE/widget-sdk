import { TecsafeArticle } from './TecsafeArticle'

/**
 * Required configuration properties for the Widget Manager.
 * See the {@link WidgetManagerConfig} for the full configuration.
 */
export class RequiredWidgetManagerConfig {
  /**
   * Will activate customer tracking. Make sure to request tracking consent from your customer and
   * set accordingly.
   */
  public trackingAllowed!: boolean
  /**
   * The RFC 4647 language tag representing the user's preferred language, e.g. "en-US"
   */
  public language!: string
  /**
   * The ISO 4217 currency code, e.g. "USD"
   */
  public currencyCode!: string
  /**
   * The price mode for the shop, either 'gross' or 'net'.
   */
  public priceMode!: 'gross' | 'net'
  /**
   * The indicative tax categories for the shop, keyed by their respective codes.
   */
  public taxCategories!: {
    S: number
    AA: number
  }
  /**
   * The TECSAFE articles listed by the shop. Sent to widgets via
   * {@link OutMessageSetTecsafeArticles}, either proactively or in response to a
   * {@link InMessageRequestTecsafeArticles}.
   */
  public tecsafeArticles!: TecsafeArticle[]
}

/**
 * The main configuration class for the Widget Manager.
 * Containing both required and optional configuration properties.
 * @category SDK
 */
export class WidgetManagerConfig extends RequiredWidgetManagerConfig {
  /**
   * Creates a new WidgetManagerConfig instance
   * @param init Required and optional configuration properties to initialize the instance with
   */
  constructor(
    init: Partial<WidgetManagerConfig> & RequiredWidgetManagerConfig
  ) {
    super()
    Object.assign(this, init)
  }

  /**
   * The base URL for the widget UIs
   */
  public widgetBaseURL: string = 'https://app-ui.tecsafe.de/iframe'

  /**
   * A list of allowed origins for the SDK to communicate with
   */
  public allowedOrigins: string[] = [
    'https://app-ui.tecsafe.de',
    'https://tecsafe.github.io',
    'https://tecsafe.de',
    'https://editor.tecsafe.de',
    'https://ofcp-editor.stage.tecsafe.de',
    'https://ofcp-editor.testing.tecsafe.de',
    'https://ofcp-editor.tecsafe-local.de',
  ]

  /**
   * Iframe styles.transition property
   */
  public iframeTransition: string = 'height 0.3s ease-in-out'

  /**
   * Enables the debug console widget. When true,
   * {@link TecsafeWidgetManager.createDebugWidget} may be used to mount the TECSAFE debug
   * console. Intended for development and integration testing only - leave it off in
   * production.
   */
  public debugWidget: boolean = false

  /**
   * Injects the SDK debug overlay into the host page. When true, the widget manager renders a
   * single collapsible overlay that logs the postMessage traffic of every widget, can send
   * arbitrary messages to a selected widget, and can reset a widget. Intended for development
   * and integration testing only - leave it off in production.
   */
  public sdkDebugger: boolean = false

  /**
   * The duration in seconds for which prices should be cached. Set to 0 to disable caching.
   */
  public priceCachingSeconds: number = 600

  /**
   * Additional indicative tax categories which the shop may have, keyed by their respective codes.
   */
  public additionalTaxCategories: {
    [key: string]: number
  } = {}
}
