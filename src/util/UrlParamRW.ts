/**
 * The parameters the sdk may store in the url of the parent page.
 * These are for example used to show the same page after a refresh.
 * @see {@link writeUrlParams} {@link readUrlParams}
 */
export interface WidgetManagerUrlParam {
  browserId: string
  url: string
}

/**
 * Writes the given parameters to the url of the parent page.
 */
export function writeUrlParams(params: WidgetManagerUrlParam): void {
  const url = new URL(window.location.href)
  url.searchParams.set('x-tecsafe-bid', params.browserId)
  url.searchParams.set('x-tecsafe-url', params.url)
  window.history.replaceState({}, '', url.toString())
}

/**
 * Reads the parameters from the url of the parent page.
 */
export function readUrlParams(): WidgetManagerUrlParam {
  const url = new URL(window.location.href)
  return {
    browserId: url.searchParams.get('x-tecsafe-bid') || '',
    url: url.searchParams.get('x-tecsafe-url') || '',
  }
}

/**
 * Clears the parameters from the url of the parent page.
 */
export function clearUrlParams(): void {
  const url = new URL(window.location.href)
  url.searchParams.delete('x-tecsafe-bid')
  url.searchParams.delete('x-tecsafe-url')
  window.history.replaceState({}, '', url.toString())
}
