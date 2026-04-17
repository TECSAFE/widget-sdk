/**
 * Required configuration properties for the Widget Manager.
 * See the {@link WidgetManagerConfig} for the full configuration.
 */
export class RequiredWidgetManagerConfig {
  /**
   * Will activate customer tracking. Make sure to request tracking consent from your customer and
   * set accordingly.
   */
  public trackingAllowed: boolean
  /**
   * The RFC 4647 language tag representing the user's preferred language, e.g. "en-US"
   */
  public languageRFC4647: string
  /**
   * The ISO 4217 currency code, e.g. "USD"
   */
  public currencyCodeISO4217: string
  /**
   * Whether tax is included in the prices. Required to display correct pricing info - gross/net.
   */
  public taxIncluded: boolean
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
  public widgetBaseURL: string = 'https://tecsafe.github.io/app-ui/iframe' // TODO: update to live page

  /**
   * A list of allowed origins for the SDK to communicate with
   */
  public allowedOrigins: string[] = ['https://tecsafe.github.io'] // TODO: update to live page

  /**
   * Iframe styles.transition property
   */
  public iframeTransition: string = 'height 0.3s ease-in-out'
}
