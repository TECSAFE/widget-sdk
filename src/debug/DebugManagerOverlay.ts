import { TecsafeWidgetManager } from '../TecsafeWidgetSDK'
import { BaseWidget } from '../types/BaseWidget'
import { OUT_MESSAGES } from '../messages/Messages'
import { MESSAGE_PRESETS } from '../messages/Presets'
import { OVERLAY_STYLES } from './OverlayStyles'
import { DebugTap, DebugTapDirection, DebugTapEvent } from './DebugTap'

/**
 * The host page overlay that visualises and drives the SDK's widget communication. It is
 * created by the widget manager when `sdkDebugger` is enabled in the configuration, renders
 * itself into a shadow root so it neither inherits nor leaks styles, and is torn down again by
 * {@link TecsafeWidgetManager.destroyAll}.
 * @category Internal
 */
export class DebugManagerOverlay {
  /**
   * Creates and mounts the overlay.
   * @param api The widget manager whose traffic is shown
   */
  constructor(private readonly api: TecsafeWidgetManager) {
    this.container = document.createElement('div')
    this.shadow = this.container.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = OVERLAY_STYLES
    this.shadow.appendChild(style)
    this.shadow.appendChild(this.buildRoot())
    document.body.appendChild(this.container)
    this.unsubscribe = DebugTap.subscribe((event) => this.onTap(event))
  }

  private readonly container: HTMLDivElement
  private readonly shadow: ShadowRoot
  private unsubscribe: (() => void) | null
  private launcher!: HTMLButtonElement
  private panel!: HTMLDivElement

  private widgetSelect!: HTMLSelectElement
  private presetSelect!: HTMLSelectElement
  private payloadInput!: HTMLTextAreaElement
  private sendForm!: HTMLDivElement
  private resetButton!: HTMLButtonElement
  private sendButton!: HTMLButtonElement
  private errorText!: HTMLParagraphElement
  private logElement!: HTMLDivElement
  private emptyState!: HTMLDivElement

  /** The widgets currently offered in the selector, in selector order. */
  private knownWidgets: BaseWidget[] = []
  /** The selected widget, or null while "All widgets" is selected. */
  private selected: BaseWidget | null = null

  /**
   * Removes the overlay from the page and stops capturing traffic. Safe to call more than once.
   */
  public destroy(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
    this.container.remove()
  }

  /**
   * Builds the collapsed launcher and the (initially hidden) panel.
   * @returns The overlay root element
   */
  private buildRoot(): HTMLDivElement {
    const root = document.createElement('div')
    root.className = 'root'

    this.launcher = document.createElement('button')
    this.launcher.className = 'launcher'
    this.launcher.textContent = 'open sdk debugger'
    this.launcher.addEventListener('click', () => this.setOpen(true))

    this.panel = this.buildPanel()

    root.appendChild(this.launcher)
    root.appendChild(this.panel)
    this.setOpen(false)
    return root
  }

  /**
   * Shows or hides the panel.
   * @param open Whether the panel should be visible
   */
  private setOpen(open: boolean): void {
    this.panel.classList.toggle('hidden', !open)
    this.launcher.classList.toggle('hidden', open)
    if (open) this.syncWidgets()
  }

  /**
   * Builds the expanded panel: widget selector, traffic log, and the send/reset controls.
   * @returns The panel element
   */
  private buildPanel(): HTMLDivElement {
    const panel = document.createElement('div')
    panel.className = 'panel'

    const title = document.createElement('h2')
    title.className = 'title'
    title.textContent = 'Debug SDK'
    panel.appendChild(title)

    panel.appendChild(this.buildSelectorRow())
    panel.appendChild(this.buildLegend())

    this.logElement = document.createElement('div')
    this.logElement.className = 'log'
    panel.appendChild(this.logElement)

    this.emptyState = document.createElement('div')
    this.emptyState.className = 'empty'
    this.emptyState.textContent = 'No events yet.'
    panel.appendChild(this.emptyState)

    panel.appendChild(this.buildActionsRow())
    panel.appendChild(this.buildSendForm())
    panel.appendChild(this.buildFooter())

    return panel
  }

  /**
   * Builds the widget selector row.
   * @returns The row element
   */
  private buildSelectorRow(): HTMLDivElement {
    const row = document.createElement('div')
    row.className = 'row'

    this.widgetSelect = document.createElement('select')
    this.widgetSelect.className = 'grow'
    this.widgetSelect.dataset.role = 'widget'
    this.widgetSelect.addEventListener('mousedown', () => this.syncWidgets())
    this.widgetSelect.addEventListener('change', () =>
      this.onWidgetSelectionChanged()
    )

    row.appendChild(this.widgetSelect)
    return row
  }

  /**
   * Builds the static legend explaining the log entry colours.
   * @returns The legend element
   */
  private buildLegend(): HTMLDivElement {
    const legend = document.createElement('div')
    legend.className = 'legend'

    const sdk = document.createElement('div')
    sdk.className = 'sdk'
    sdk.textContent = 'SDK → Widget'

    const widget = document.createElement('div')
    widget.className = 'widget'
    widget.textContent = 'Widget → SDK'

    legend.appendChild(sdk)
    legend.appendChild(widget)
    return legend
  }

  /**
   * Builds the clear/reset/send-open action row.
   * @returns The row element
   */
  private buildActionsRow(): HTMLDivElement {
    const row = document.createElement('div')
    row.className = 'row'

    const clearButton = document.createElement('button')
    clearButton.dataset.action = 'clear'
    clearButton.textContent = 'clear'
    clearButton.addEventListener('click', () => this.clearLog())

    this.resetButton = document.createElement('button')
    this.resetButton.dataset.action = 'reset'
    this.resetButton.textContent = 'reset widget'
    this.resetButton.addEventListener('click', () => this.resetSelected())

    const sendOpenButton = document.createElement('button')
    sendOpenButton.dataset.action = 'send-open'
    sendOpenButton.textContent = 'send message'
    sendOpenButton.addEventListener('click', () => this.toggleSendForm())

    row.appendChild(clearButton)
    row.appendChild(this.resetButton)
    row.appendChild(sendOpenButton)
    return row
  }

  /**
   * Builds the (initially hidden) send-message form.
   * @returns The form container
   */
  private buildSendForm(): HTMLDivElement {
    this.sendForm = document.createElement('div')
    this.sendForm.className = 'hidden'

    this.presetSelect = document.createElement('select')
    this.presetSelect.dataset.role = 'preset'
    const blank = document.createElement('option')
    blank.value = ''
    blank.textContent = 'Choose a preset…'
    this.presetSelect.appendChild(blank)
    for (const [key, definition] of Object.entries(OUT_MESSAGES)) {
      const option = document.createElement('option')
      option.value = definition.type
      option.textContent = `${key} - ${definition.type}`
      this.presetSelect.appendChild(option)
    }
    this.presetSelect.addEventListener('change', () => this.applyPreset())

    this.payloadInput = document.createElement('textarea')
    this.payloadInput.dataset.role = 'payload'

    this.sendButton = document.createElement('button')
    this.sendButton.dataset.action = 'send'
    this.sendButton.textContent = 'Send to Widget'
    this.sendButton.addEventListener('click', () => this.sendPayload())

    this.errorText = document.createElement('p')
    this.errorText.className = 'error'

    this.sendForm.appendChild(this.presetSelect)
    this.sendForm.appendChild(this.payloadInput)
    this.sendForm.appendChild(this.sendButton)
    this.sendForm.appendChild(this.errorText)
    return this.sendForm
  }

  /**
   * Builds the panel footer with the close button.
   * @returns The footer row
   */
  private buildFooter(): HTMLDivElement {
    const footer = document.createElement('div')
    footer.className = 'row'
    const grow = document.createElement('div')
    grow.className = 'grow'
    const close = document.createElement('button')
    close.dataset.action = 'close'
    close.textContent = 'close debugger'
    close.addEventListener('click', () => this.setOpen(false))
    footer.appendChild(grow)
    footer.appendChild(close)
    return footer
  }

  /**
   * Refreshes the widget selector from the manager's current widget list. Bails out without
   * touching the DOM if the widget list has not actually changed, so an open selector is not
   * disturbed while the user is interacting with it.
   */
  private syncWidgets(): void {
    const next = [
      this.api.getAppWidget() as unknown as BaseWidget,
      ...(this.api.getWidgets() as unknown as BaseWidget[]),
    ]
    const unchanged =
      next.length === this.knownWidgets.length &&
      next.every((widget, index) => widget === this.knownWidgets[index])
    if (unchanged) return

    const previousSelected = this.selected
    this.knownWidgets = next
    this.rebuildWidgetOptions()

    if (previousSelected && next.includes(previousSelected)) {
      this.selected = previousSelected
      this.widgetSelect.value = String(next.indexOf(previousSelected))
    } else {
      this.selected = null
      this.widgetSelect.value = 'all'
      if (previousSelected) this.logSystem('Selected widget was destroyed')
    }
    this.updateControls()
  }

  /**
   * Rebuilds the `<select>` options from {@link DebugManagerOverlay.knownWidgets}, disambiguating
   * widgets that report the same debug label.
   */
  private rebuildWidgetOptions(): void {
    this.widgetSelect.replaceChildren()

    const allOption = document.createElement('option')
    allOption.value = 'all'
    allOption.textContent = 'All widgets'
    this.widgetSelect.appendChild(allOption)

    const labelCounts = new Map<string, number>()
    for (const widget of this.knownWidgets) {
      const label = widget._getDebugLabel()
      labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1)
    }

    const seenSoFar = new Map<string, number>()
    this.knownWidgets.forEach((widget, index) => {
      const label = widget._getDebugLabel()
      let displayLabel = label
      if ((labelCounts.get(label) ?? 0) > 1) {
        const occurrence = (seenSoFar.get(label) ?? 0) + 1
        seenSoFar.set(label, occurrence)
        displayLabel = `${label} #${occurrence}`
      }
      const option = document.createElement('option')
      option.value = String(index)
      option.textContent = displayLabel
      this.widgetSelect.appendChild(option)
    })
  }

  /**
   * Resolves {@link DebugManagerOverlay.selected} from the selector's current value.
   */
  private onWidgetSelectionChanged(): void {
    const value = this.widgetSelect.value
    this.selected =
      value === 'all' ? null : (this.knownWidgets[Number(value)] ?? null)
    this.updateControls()
  }

  /**
   * Enables or disables the widget-scoped controls depending on whether a specific widget, as
   * opposed to "All widgets", is selected.
   */
  private updateControls(): void {
    const disabled = this.selected === null
    this.resetButton.disabled = disabled
    this.sendButton.disabled = disabled
  }

  /**
   * Handles a captured message exchange: picks up widgets the selector does not know about yet,
   * filters by the current selection, and logs matching exchanges.
   * @param event The captured exchange
   */
  private onTap(event: DebugTapEvent): void {
    const widget = event.widget as BaseWidget
    if (!this.knownWidgets.includes(widget)) this.syncWidgets()
    if (this.selected && widget !== this.selected) return
    this.logEntry(event)
  }

  /**
   * Logs a single captured message exchange.
   * @param event The captured exchange
   */
  private logEntry(event: DebugTapEvent): void {
    const widget = event.widget as BaseWidget
    const time = new Date().toLocaleTimeString()
    const suffix = this.selected === null ? ` - ${widget._getDebugLabel()}` : ''
    const meta = `${time} - ${event.envelope.type}${suffix}`
    const payloadText = JSON.stringify(event.envelope.payload)
    this.appendLogEntry(
      event.direction,
      meta,
      payloadText === undefined ? 'undefined' : payloadText
    )
  }

  /**
   * Logs a system notice, e.g. that the selected widget was destroyed or reset.
   * @param text The notice to display
   */
  private logSystem(text: string): void {
    const entry = document.createElement('div')
    entry.className = 'entry system'
    entry.textContent = `--- ${text} ---`
    this.prependLogEntry(entry)
  }

  /**
   * Builds and prepends a message log entry.
   * @param direction The direction the message travelled in
   * @param meta The entry's meta line
   * @param payloadText The stringified payload
   */
  private appendLogEntry(
    direction: DebugTapDirection,
    meta: string,
    payloadText: string
  ): void {
    const entry = document.createElement('div')
    entry.className = `entry ${direction}`

    const metaEl = document.createElement('p')
    metaEl.className = 'entry-meta'
    metaEl.textContent = meta

    const payloadEl = document.createElement('p')
    payloadEl.className = 'entry-payload'
    payloadEl.textContent = payloadText

    entry.appendChild(metaEl)
    entry.appendChild(payloadEl)
    this.prependLogEntry(entry)
  }

  /**
   * Prepends an entry to the log, capping it at 100 entries and toggling the empty state.
   * @param entry The entry to prepend
   */
  private prependLogEntry(entry: HTMLElement): void {
    this.logElement.prepend(entry)
    while (this.logElement.childElementCount > 100) {
      this.logElement.lastElementChild?.remove()
    }
    this.emptyState.classList.toggle(
      'hidden',
      this.logElement.childElementCount > 0
    )
  }

  /**
   * Clears the message log and restores the empty state.
   */
  private clearLog(): void {
    this.logElement.replaceChildren()
    this.emptyState.classList.remove('hidden')
  }

  /**
   * Toggles visibility of the send-message form.
   */
  private toggleSendForm(): void {
    this.sendForm.classList.toggle('hidden')
  }

  /**
   * Fills the payload textarea from the selected preset.
   */
  private applyPreset(): void {
    const type = this.presetSelect.value
    if (!type) return
    const payload = MESSAGE_PRESETS[type] ?? null
    this.payloadInput.value = JSON.stringify({ type, payload }, null, 2)
  }

  /**
   * Parses the payload textarea and sends it to the selected widget. Invalid JSON is reported
   * inline instead of being sent.
   */
  private sendPayload(): void {
    if (!this.selected) return
    try {
      const parsed = JSON.parse(this.payloadInput.value)
      this.errorText.textContent = ''
      this.selected.sendMessage(parsed)
    } catch (error) {
      this.errorText.textContent = String(error)
    }
  }

  /**
   * Destroys and re-shows the selected widget.
   */
  private resetSelected(): void {
    const widget = this.selected
    if (!widget) return
    widget.destroy()
    widget.show()
    this.logSystem('Widget reset')
  }
}
