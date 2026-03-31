import { MessageEnvelope } from './MessageEnvelope'

/**
 * Interface for a widget, setting up a common ground for the compiler/typescript.
 */
export interface IWidget {
  sendMessage(message: MessageEnvelope): void
  getIframe(): HTMLIFrameElement | null
  getMessageListeners(): string[]
}

/**
 * Interface for an app widget, extending the IWidget interface
 */
export interface IAppWidget extends IWidget {
  isOpen(): boolean
}

/**
 * Interface for the SDK, setting up a common ground for the compiler/typescript.
 */
export interface ISDK {
  openFullScreen(url: string): void
  closeFullScreen(): void
  destroyFullScreen(): void
  getToken(refresh?: boolean): Promise<string>
  getAppWidget(): IAppWidget
  getMessageListeners(): string[]
  _triggerListeners(type: string, payload: any, widget: IWidget): void
}
