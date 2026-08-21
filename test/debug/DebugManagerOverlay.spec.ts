import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals'
import { DebugManagerOverlay } from '../../src/debug/DebugManagerOverlay'
import { DebugTap } from '../../src/debug/DebugTap'
import { OUT_MESSAGES } from '../../src/messages/Messages'

const makeWidget = (label: string) => ({
  _getDebugLabel: () => label,
  sendMessage: jest.fn(),
  destroy: jest.fn(),
  show: jest.fn(),
})

const makeApi = () => {
  const appWidget = makeWidget('App')
  const widgets: any[] = []
  return {
    getAppWidget: () => appWidget,
    getWidgets: () => widgets,
    appWidget,
    widgets,
  }
}

const shadow = (overlay: DebugManagerOverlay): ShadowRoot =>
  (overlay as any).shadow as ShadowRoot

const open = (overlay: DebugManagerOverlay) => {
  const root = shadow(overlay)
  root.querySelector<HTMLButtonElement>('.launcher')!.click()
  return root
}

const select = (root: ShadowRoot, role: string) =>
  root.querySelector<HTMLSelectElement>(`[data-role="${role}"]`)!

const click = (root: ShadowRoot, action: string) =>
  root.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)!.click()

describe('DebugManagerOverlay', () => {
  let overlay: DebugManagerOverlay | null = null

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    overlay?.destroy()
    overlay = null
    document.body.innerHTML = ''
  })

  it('mounts a shadow root into the body and starts collapsed', () => {
    overlay = new DebugManagerOverlay(makeApi() as never)
    const root = shadow(overlay)
    expect(root).toBeTruthy()
    expect(root.querySelector('.launcher')?.textContent).toBe(
      'open sdk debugger'
    )
    expect(root.querySelector('.panel')?.classList.contains('hidden')).toBe(
      true
    )
  })

  it('expands and collapses again', () => {
    overlay = new DebugManagerOverlay(makeApi() as never)
    const root = shadow(overlay)

    root.querySelector<HTMLButtonElement>('.launcher')!.click()
    expect(root.querySelector('.panel')?.classList.contains('hidden')).toBe(
      false
    )
    expect(root.querySelector('.launcher')?.classList.contains('hidden')).toBe(
      true
    )

    root.querySelector<HTMLButtonElement>('[data-action="close"]')!.click()
    expect(root.querySelector('.panel')?.classList.contains('hidden')).toBe(
      true
    )
    expect(root.querySelector('.launcher')?.classList.contains('hidden')).toBe(
      false
    )
  })

  it('removes itself from the page and unsubscribes on destroy', () => {
    overlay = new DebugManagerOverlay(makeApi() as never)
    expect((DebugTap as any).listeners).toHaveLength(1)

    overlay.destroy()
    expect(document.body.childElementCount).toBe(0)
    expect((DebugTap as any).listeners).toHaveLength(0)

    expect(() => overlay!.destroy()).not.toThrow()
    overlay = null
  })
})

describe('DebugManagerOverlay contents', () => {
  let api: ReturnType<typeof makeApi>
  let overlay: DebugManagerOverlay

  beforeEach(() => {
    document.body.innerHTML = ''
    api = makeApi()
    overlay = new DebugManagerOverlay(api as never)
  })

  afterEach(() => {
    overlay.destroy()
    document.body.innerHTML = ''
  })

  it('lists every live widget plus an all-widgets option', () => {
    api.widgets.push(makeWidget('ProductDetail(TEST-123)'), makeWidget('Debug'))
    const root = open(overlay)
    const labels = [...select(root, 'widget').options].map((o) => o.textContent)
    expect(labels).toEqual([
      'All widgets',
      'App',
      'ProductDetail(TEST-123)',
      'Debug',
    ])
  })

  it('disambiguates duplicate labels', () => {
    api.widgets.push(makeWidget('CustomPage'), makeWidget('CustomPage'))
    const root = open(overlay)
    const labels = [...select(root, 'widget').options].map((o) => o.textContent)
    expect(labels).toEqual([
      'All widgets',
      'App',
      'CustomPage #1',
      'CustomPage #2',
    ])
  })

  it('logs traffic newest first with direction, type and payload', () => {
    const root = open(overlay)
    DebugTap.report(api.appWidget as never, 'in', {
      type: 'tecsafe-ping',
      payload: { version: '1' },
    })
    DebugTap.report(api.appWidget as never, 'out', {
      type: 'tecsafe-pong',
      payload: { version: '2' },
    })

    const entries = [...root.querySelectorAll('.log .entry')]
    expect(entries).toHaveLength(2)
    expect(entries[0]!.classList.contains('out')).toBe(true)
    expect(entries[0]!.querySelector('.entry-meta')!.textContent).toContain(
      'tecsafe-pong'
    )
    expect(entries[0]!.querySelector('.entry-payload')!.textContent).toBe(
      '{"version":"2"}'
    )
    expect(entries[1]!.classList.contains('in')).toBe(true)
  })

  it('shows the empty state until traffic arrives and after clear', () => {
    const root = open(overlay)
    expect(root.querySelector('.empty')!.classList.contains('hidden')).toBe(
      false
    )

    DebugTap.report(api.appWidget as never, 'in', { type: 'a', payload: 1 })
    expect(root.querySelector('.empty')!.classList.contains('hidden')).toBe(
      true
    )

    click(root, 'clear')
    expect(root.querySelectorAll('.log .entry')).toHaveLength(0)
    expect(root.querySelector('.empty')!.classList.contains('hidden')).toBe(
      false
    )
  })

  it('caps the log at 100 entries', () => {
    const root = open(overlay)
    for (let i = 0; i < 120; i++) {
      DebugTap.report(api.appWidget as never, 'in', { type: 't', payload: i })
    }
    expect(root.querySelectorAll('.log .entry')).toHaveLength(100)
    expect(root.querySelector('.log .entry .entry-payload')!.textContent).toBe(
      '119'
    )
  })

  it('only logs the selected widget while one is selected', () => {
    const other = makeWidget('Debug')
    api.widgets.push(other)
    const root = open(overlay)
    const widgetSelect = select(root, 'widget')
    widgetSelect.value = [...widgetSelect.options].find(
      (o) => o.textContent === 'Debug'
    )!.value
    widgetSelect.dispatchEvent(new Event('change'))

    DebugTap.report(api.appWidget as never, 'in', {
      type: 'ignored',
      payload: null,
    })
    DebugTap.report(other as never, 'in', { type: 'kept', payload: null })

    const metas = [...root.querySelectorAll('.log .entry-meta')].map(
      (n) => n.textContent
    )
    expect(metas).toHaveLength(1)
    expect(metas[0]).toContain('kept')
  })

  it('tags entries with the widget label while all widgets are selected', () => {
    const root = open(overlay)
    DebugTap.report(api.appWidget as never, 'in', { type: 'a', payload: null })
    expect(root.querySelector('.log .entry-meta')!.textContent).toContain('App')
  })

  it('fills the textarea from a preset', () => {
    const root = open(overlay)
    click(root, 'send-open')
    const presetSelect = select(root, 'preset')
    presetSelect.value = OUT_MESSAGES.OutMessageSetToken.type
    presetSelect.dispatchEvent(new Event('change'))

    expect(JSON.parse(select(root, 'payload').value)).toEqual({
      type: OUT_MESSAGES.OutMessageSetToken.type,
      payload: OUT_MESSAGES.OutMessageSetToken.preset(),
    })
  })

  it('sends the parsed payload to the selected widget', () => {
    const root = open(overlay)
    const widgetSelect = select(root, 'widget')
    widgetSelect.value = [...widgetSelect.options].find(
      (o) => o.textContent === 'App'
    )!.value
    widgetSelect.dispatchEvent(new Event('change'))

    click(root, 'send-open')
    const textarea = root.querySelector<HTMLTextAreaElement>(
      '[data-role="payload"]'
    )!
    textarea.value = '{"type":"set-token","payload":{"token":"t"}}'
    click(root, 'send')

    expect(api.appWidget.sendMessage).toHaveBeenCalledWith({
      type: 'set-token',
      payload: { token: 't' },
    })
    expect(root.querySelector('.error')!.textContent).toBe('')
  })

  it('reports invalid JSON inline and sends nothing', () => {
    const root = open(overlay)
    const widgetSelect = select(root, 'widget')
    widgetSelect.value = [...widgetSelect.options].find(
      (o) => o.textContent === 'App'
    )!.value
    widgetSelect.dispatchEvent(new Event('change'))

    click(root, 'send-open')
    root.querySelector<HTMLTextAreaElement>('[data-role="payload"]')!.value =
      '{nope'
    click(root, 'send')

    expect(api.appWidget.sendMessage).not.toHaveBeenCalled()
    expect(root.querySelector('.error')!.textContent).not.toBe('')
  })

  it('resets the selected widget and logs it', () => {
    const root = open(overlay)
    const widgetSelect = select(root, 'widget')
    widgetSelect.value = [...widgetSelect.options].find(
      (o) => o.textContent === 'App'
    )!.value
    widgetSelect.dispatchEvent(new Event('change'))

    click(root, 'reset')

    expect(api.appWidget.destroy).toHaveBeenCalledTimes(1)
    expect(api.appWidget.show).toHaveBeenCalledTimes(1)
    expect(root.querySelector('.log .entry.system')!.textContent).toContain(
      'Widget reset'
    )
  })

  it('disables the widget scoped controls while all widgets are selected', () => {
    const root = open(overlay)
    expect(
      root.querySelector<HTMLButtonElement>('[data-action="reset"]')!.disabled
    ).toBe(true)
    expect(
      root.querySelector<HTMLButtonElement>('[data-action="send"]')!.disabled
    ).toBe(true)
  })

  it('falls back to all widgets when the selected widget is destroyed', () => {
    const widget = makeWidget('Debug')
    api.widgets.push(widget)
    const root = open(overlay)
    const widgetSelect = select(root, 'widget')
    widgetSelect.value = [...widgetSelect.options].find(
      (o) => o.textContent === 'Debug'
    )!.value
    widgetSelect.dispatchEvent(new Event('change'))

    api.widgets.length = 0
    widgetSelect.dispatchEvent(new Event('mousedown'))

    expect(widgetSelect.value).toBe('all')
    expect(root.querySelector('.log .entry.system')!.textContent).toContain(
      'Selected widget was destroyed'
    )
    expect(
      root.querySelector<HTMLButtonElement>('[data-action="reset"]')!.disabled
    ).toBe(true)
  })

  it('picks up a widget created after the panel was opened', () => {
    const root = open(overlay)
    const late = makeWidget('Debug')
    api.widgets.push(late)

    DebugTap.report(late as never, 'in', { type: 'a', payload: null })

    const labels = [...select(root, 'widget').options].map((o) => o.textContent)
    expect(labels).toContain('Debug')
  })
})
