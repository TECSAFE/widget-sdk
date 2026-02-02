/**
 * Required configuration properties for the Widget Manager
 */
export class RequiredWidgetManagerConfig {
  /**
   * Whether tracking is allowed or not. If customer has consented to tracking, set to true.
   */
  public trackingAllowed: boolean
  /**
   * The RFC 4647 language tag representing the user's preferred language, e.g. "en-US"
   */
  public languageRFC4647: string
  /**
   * The currency code, e.g. "USD"
   */
  public currencyCode: string
  /**
   * The currency symbol, e.g. "$"
   */
  public currencySymbol: string
  /**
   * Whether tax is included in the prices
   */
  public taxIncluded: boolean
}

/**
 * The main configuration class for the Widget Manager.
 * Containing both required and optional configuration properties.
 */
export class WidgetManagerConfig extends RequiredWidgetManagerConfig {
  /**
   * Creates a new WidgetManagerConfig instance
   * @param init Required and optional configuration properties to initialize the instance with
   */
  constructor(init: Partial<WidgetManagerConfig> & RequiredWidgetManagerConfig) {
    super()
    Object.assign(this, init)
  }

  /**
   * The base URL for the widget UIs
   */
  public widgetBaseURL: string = 'https://tecsafe.github.io/app-ui/iframe'

  /**
   * A list of allowed origins for the SDK to communicate with
   */
  public allowedOrigins: string[] = ['https://tecsafe.github.io']

  /**
   * Iframe styles.transition property
   */
  public iframeTransition: string = 'height 0.3s ease-in-out'
}
