import { IAppWidget } from 'src/types/Context'
import { BaseWidget } from '../types/BaseWidget'

import { writeUrlParams, clearUrlParams } from '../util/UrlParamRW'
import { Logger } from '../util/Logger'

/**
 * **The WidgetManager does handle creation and destruction of this widget under the hood.**
 * A widget that takes up the full screen, and is used to display different parts of the app.
 * @see {@link TecsafeWidgetManager}
 * @category Internal
 */
export class AppWidget extends BaseWidget implements IAppWidget {
  /**
   * The app widget allows any origin defined in the config, so it does not have a uiPath
   * @see {@link AppWidget.setUrl} {@link AppWidget.getUrl}
   */
  protected url: string

  /**
   * Sets the url of the widget
   * @param url The url of the widget
   * @throws If the url is not allowed by the config
   * @see {@link AppWidget.url} {@link AppWidget.getUrl}
   */
  public setUrl(url: string): void {
    const { origin } = new URL(url)
    if (!this.config.allowedOrigins.includes(origin)) {
      throw new Error(
        `[TECSAFE] Widget ${this.el} cannot set url to origin ${origin}`
      )
    }
    this.url = url
    writeUrlParams({ browserId: this.api.getBrowserId(), url })
    this.show()
  }

  /**
   * Gets the url of the widget
   * @returns The url of the widget
   * @see {@link AppWidget.setUrl} {@link AppWidget.url}
   */
  public getUrl(): string {
    return this.url
  }

  /**
   * @inheritdoc
   */
  protected preCreate(): void {
    if (!document.body.contains(this.el)) {
      this.el = document.createElement('div')
      document.body.appendChild(this.el)
    }
  }

  /**
   * @inheritdoc
   */
  protected postCreate(): void {
    if (!this.iframe) return
    const style = this.iframe.style
    style.position = 'fixed'
    style.top = '0'
    style.left = '0'
    style.width = '100vw'
    style.height = '100vh'
    style.zIndex = '1000000'
  }

  /**
   * If the iframe loads a new page, stores the url in the get parameters of the parent page.
   * This ensures if a user refreshes the page, they will be taken back to the same place.
   */
  protected handlePageLoad(): void {
    const url = this.iframe.contentWindow.location.href
    const { origin } = new URL(url)
    if (!this.config.allowedOrigins.includes(origin)) {
      this.destroy()
      Logger.getInstance().error(
        'Widget',
        String(this.el),
        'cannot load url',
        url
      )
    }
  }

  /**
   * @inheritdoc
   */
  protected postShow(): void {
    if (!this.url) {
      this.destroy()
      throw new Error(`[TECSAFE] Widget ${this.el} cannot show without a url`)
    }
    if (this.iframe.src !== this.url) this.iframe.src = this.url
    const style = document.body.style
    style.overflow = 'hidden'
    if (!style.paddingRight) style.paddingRight = '15px'
    writeUrlParams({ browserId: this.api.getBrowserId(), url: this.url })
  }

  /**
   * Resets the parent page to its original state after the widget is hidden or destroyed
   */
  protected resetParentPage() {
    const style = document.body.style
    style.overflow = ''
    if (style.paddingRight === '15px') style.paddingRight = ''
    clearUrlParams()
  }

  /**
   * @inheritdoc
   */
  protected postDestroy(): void {
    this.resetParentPage()
    document.body.removeChild(this.el)
  }

  /**
   * @inheritdoc
   */
  protected postHide(): void {
    this.resetParentPage()
  }

  /**
   * Not required for AppWidget, as it uses url instead of uiPath
   * @see {@link AppWidget.url}
   */
  protected readonly uiPath = ''
}
