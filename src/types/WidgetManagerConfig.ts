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
  public languageRFC4647!: string
  /**
   * The ISO 4217 currency code, e.g. "USD"
   */
  public currencyCodeISO4217!: string
  /**
   * Whether tax is included in the prices. Required to display correct pricing info - gross/net.
   */
  public taxIncluded!: boolean
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
    'app-ui.tecsafe.de',
    'tecsafe.github.io',
    'tecsafe.de',
    'editor.tecsafe.de',
    'ofcp-editor.stage.tecsafe.de',
    'ofcp-editor.testing.tecsafe.de',
    'ofcp-editor.tecsafe-local.de',
    'example.com',
  ] // TODO: update to live page

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
}
