import { MessageEnvelope } from './MessageEnvelope'

export interface IWidget {
  sendMessage(message: MessageEnvelope): void
  getIframe(): HTMLIFrameElement | null
  getMessageListeners(): string[]
}

export interface IAppWidget extends IWidget {
  isOpen(): boolean
}

export interface ISDK {
  openFullScreen(url: string): void
  closeFullScreen(destroy?: boolean): void
  getToken(refresh?: boolean): Promise<string>
  getAppWidget(): IAppWidget
  getMessageListeners(): string[]
  _triggerListeners(type: string, payload: any, widget: IWidget): void
}
